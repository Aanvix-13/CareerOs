-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Wishlist', 'Preparing', 'Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Final Interview', 'Offer Received', 'Offer Accepted', 'Offer Declined', 'Rejected', 'Withdrawn', 'Archived');

-- CreateEnum
CREATE TYPE "ReminderPriority" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('Pending', 'Completed', 'Overdue');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('Follow-up', 'Interview', 'Assessment', 'Document Submission', 'Offer Deadline', 'Personal', 'Other');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show');

-- CreateEnum
CREATE TYPE "InterviewResult" AS ENUM ('Pending', 'Passed', 'Failed', 'Waiting', 'Selected');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('Online', 'Offline', 'Phone', 'Video');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('Unread', 'Read');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('Welcome', 'Application Created', 'Application Updated', 'Interview Scheduled', 'Interview Today', 'Reminder Due', 'Reminder Overdue', 'System Announcement');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('Submitted', 'Under Review', 'Planned', 'Completed', 'Closed');

-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('Bug Report', 'Feature Request', 'Improvement Suggestion', 'General Feedback');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('Full Time', 'Internship', 'Part Time', 'Contract', 'Freelance');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('Remote', 'Hybrid', 'On-site');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "profile_image_url" TEXT,
    "phone" VARCHAR(20),
    "college" VARCHAR(150),
    "degree" VARCHAR(100),
    "specialization" VARCHAR(100),
    "graduation_year" INTEGER,
    "preferred_role" VARCHAR(100),
    "preferred_location" VARCHAR(100),
    "bio" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "target_role" VARCHAR(100),
    "version" VARCHAR(30),
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "notes" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "resume_id" UUID NOT NULL,
    "company_name" VARCHAR(150) NOT NULL,
    "job_title" VARCHAR(150) NOT NULL,
    "department" VARCHAR(100),
    "job_type" "JobType" NOT NULL,
    "work_mode" "WorkMode" NOT NULL,
    "location" VARCHAR(100),
    "source" VARCHAR(100) NOT NULL,
    "recruiter_name" VARCHAR(100),
    "recruiter_email" VARCHAR(255),
    "salary" DECIMAL(12,2),
    "job_url" TEXT,
    "notes" TEXT,
    "current_status" "ApplicationStatus" NOT NULL,
    "application_date" DATE NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_status_history" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "previous_status" "ApplicationStatus",
    "new_status" "ApplicationStatus" NOT NULL,
    "changed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "application_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "interview_round" VARCHAR(100) NOT NULL,
    "interview_type" "InterviewType" NOT NULL,
    "interview_status" "InterviewStatus" NOT NULL,
    "interview_result" "InterviewResult" NOT NULL,
    "interviewer_name" VARCHAR(100),
    "interviewer_email" VARCHAR(255),
    "meeting_platform" VARCHAR(100),
    "meeting_link" TEXT,
    "scheduled_date" DATE NOT NULL,
    "scheduled_time" TIME(0) NOT NULL,
    "timezone" VARCHAR(100) NOT NULL,
    "preparation_notes" TEXT,
    "interview_feedback" TEXT,
    "questions_asked" TEXT,
    "personal_notes" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "application_id" UUID,
    "interview_id" UUID,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "reminder_type" "ReminderType" NOT NULL,
    "priority" "ReminderPriority" NOT NULL,
    "status" "ReminderStatus" NOT NULL,
    "due_date" DATE NOT NULL,
    "due_time" TIME(0),
    "completed_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category" "FeedbackCategory" NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "screenshot_url" TEXT,
    "status" "FeedbackStatus" NOT NULL,
    "app_version" VARCHAR(30) NOT NULL,
    "browser" VARCHAR(100) NOT NULL,
    "device" VARCHAR(100) NOT NULL,
    "submitted_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "related_entity" VARCHAR(50),
    "related_entity_id" UUID,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE INDEX "resumes_user_id_idx" ON "resumes"("user_id");

-- CreateIndex
CREATE INDEX "resumes_is_default_idx" ON "resumes"("is_default");

-- CreateIndex
CREATE INDEX "applications_user_id_idx" ON "applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_resume_id_idx" ON "applications"("resume_id");

-- CreateIndex
CREATE INDEX "applications_company_name_idx" ON "applications"("company_name");

-- CreateIndex
CREATE INDEX "applications_current_status_idx" ON "applications"("current_status");

-- CreateIndex
CREATE INDEX "applications_application_date_idx" ON "applications"("application_date");

-- CreateIndex
CREATE INDEX "applications_source_idx" ON "applications"("source");

-- CreateIndex
CREATE INDEX "application_status_history_application_id_idx" ON "application_status_history"("application_id");

-- CreateIndex
CREATE INDEX "application_status_history_changed_at_idx" ON "application_status_history"("changed_at");

-- CreateIndex
CREATE INDEX "interviews_application_id_idx" ON "interviews"("application_id");

-- CreateIndex
CREATE INDEX "interviews_scheduled_date_idx" ON "interviews"("scheduled_date");

-- CreateIndex
CREATE INDEX "interviews_interview_status_idx" ON "interviews"("interview_status");

-- CreateIndex
CREATE INDEX "reminders_user_id_idx" ON "reminders"("user_id");

-- CreateIndex
CREATE INDEX "reminders_application_id_idx" ON "reminders"("application_id");

-- CreateIndex
CREATE INDEX "reminders_interview_id_idx" ON "reminders"("interview_id");

-- CreateIndex
CREATE INDEX "reminders_due_date_idx" ON "reminders"("due_date");

-- CreateIndex
CREATE INDEX "reminders_priority_idx" ON "reminders"("priority");

-- CreateIndex
CREATE INDEX "reminders_status_idx" ON "reminders"("status");

-- CreateIndex
CREATE INDEX "feedback_user_id_idx" ON "feedback"("user_id");

-- CreateIndex
CREATE INDEX "feedback_category_idx" ON "feedback"("category");

-- CreateIndex
CREATE INDEX "feedback_status_idx" ON "feedback"("status");

-- CreateIndex
CREATE INDEX "feedback_submitted_at_idx" ON "feedback"("submitted_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
