-- Run after supabase/schema.sql in the Supabase SQL Editor.
-- This migration hardens role/profile access and provisions a profile on signup.

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role TEXT;
BEGIN
  requested_role := NEW.raw_user_meta_data ->> 'role';
  IF requested_role NOT IN ('job_seeker', 'employer') THEN
    requested_role := 'job_seeker';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, location)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    requested_role,
    NULLIF(NEW.raw_user_meta_data ->> 'location', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Do not allow a regular user to grant themselves admin privileges or change roles.
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND auth.uid() IS NOT NULL
     AND public.current_user_role() <> 'admin' THEN
    RAISE EXCEPTION 'Only an administrator can change account roles';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role_trigger ON public.profiles;
CREATE TRIGGER protect_profile_role_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- Replace recursive/profile self-escalation policies from the initial schema.
DROP POLICY IF EXISTS "Profiles are viewable by owner or admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by owner or admin" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert a profile" ON public.profiles;
CREATE POLICY "Profile is visible to owner or admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.current_user_role() = 'admin');
CREATE POLICY "Profile is editable by owner or admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (id = auth.uid() OR public.current_user_role() = 'admin');
CREATE POLICY "Admin can insert profiles" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.current_user_role() = 'admin');

-- Public job listings must be approved; employers only see their own unapproved listings.
DROP POLICY IF EXISTS "Jobs readable to all" ON public.jobs;
DROP POLICY IF EXISTS "Employers can manage jobs" ON public.jobs;
CREATE POLICY "Approved jobs are public, owners and admins can review" ON public.jobs
  FOR SELECT
  USING (
    status = 'approved'
    OR employer_id = auth.uid()
    OR public.current_user_role() = 'admin'
  );
CREATE POLICY "Employer owns job or admin manages it" ON public.jobs
  FOR ALL TO authenticated
  USING (employer_id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (employer_id = auth.uid() OR public.current_user_role() = 'admin');

-- Employers may only read applications addressed to them; applicants retain access to their own.
DROP POLICY IF EXISTS "Applications readable by applicant, employer, or admin" ON public.applications;
DROP POLICY IF EXISTS "Applicants can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Applicants or employers can update applications" ON public.applications;
CREATE POLICY "Application visible to applicant employer or admin" ON public.applications
  FOR SELECT TO authenticated
  USING (
    applicant_id = auth.uid()
    OR employer_id = auth.uid()
    OR public.current_user_role() = 'admin'
  );
CREATE POLICY "Job seekers can submit applications" ON public.applications
  FOR INSERT TO authenticated
  WITH CHECK (
    applicant_id = auth.uid()
    AND public.current_user_role() = 'job_seeker'
    AND status = 'Pending'
  );
CREATE POLICY "Employer or admin can update application status" ON public.applications
  FOR UPDATE TO authenticated
  USING (employer_id = auth.uid() OR public.current_user_role() = 'admin')
  WITH CHECK (employer_id = auth.uid() OR public.current_user_role() = 'admin');

-- Private CV storage. Objects use the auth user UUID as the first path segment.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('candidate-cvs', 'candidate-cvs', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf'];

DROP POLICY IF EXISTS "Users upload own CVs" ON storage.objects;
CREATE POLICY "Users upload own CVs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'candidate-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users read own CVs" ON storage.objects;
CREATE POLICY "Users read own CVs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'candidate-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users update own CVs" ON storage.objects;
CREATE POLICY "Users update own CVs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'candidate-cvs' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'candidate-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users delete own CVs" ON storage.objects;
CREATE POLICY "Users delete own CVs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'candidate-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
