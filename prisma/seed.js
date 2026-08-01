const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not defined.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding plan definitions...');

  const plans = [
    {
      plan: 'FREE',
      monthlyPrice: 0.00,
      yearlyPrice: 0.00,
      configuration: {
        limits: {
          APPLICATIONS: 10,
          RESUMES: 5,
          INTERVIEWS: 10,
          REMINDERS: 25,
          STORAGE: 100 * 1024 * 1024, // 100 MB in bytes
          AI_ANALYSIS: 0,
          AI_MATCH: 0,
          AI_REWRITE: 0,
          AI_COVER_LETTER: 0,
          AI_INTERVIEW: 0,
          CAREER_INSIGHTS: 0
        },
        features: {
          BASIC_ANALYTICS: true,
          ADVANCED_ANALYTICS: false,
          EXPORT_PDF: false,
          EXPORT_CSV: false,
          RESUME_VERSION_HISTORY: false,
          CUSTOM_TAGS: false,
          ARCHIVE_APPLICATIONS: false,
          DASHBOARD_CUSTOMIZATION: false,
          AI_WORKSPACE: false
        }
      }
    },
    {
      plan: 'PRO',
      monthlyPrice: 199.00,
      yearlyPrice: 1999.00,
      configuration: {
        limits: {
          APPLICATIONS: -1, // Unlimited
          RESUMES: -1,
          INTERVIEWS: -1,
          REMINDERS: -1,
          STORAGE: 2 * 1024 * 1024 * 1024, // 2 GB in bytes
          AI_ANALYSIS: 0,
          AI_MATCH: 0,
          AI_REWRITE: 0,
          AI_COVER_LETTER: 0,
          AI_INTERVIEW: 0,
          CAREER_INSIGHTS: 0
        },
        features: {
          BASIC_ANALYTICS: true,
          ADVANCED_ANALYTICS: true,
          EXPORT_PDF: true,
          EXPORT_CSV: true,
          RESUME_VERSION_HISTORY: true,
          CUSTOM_TAGS: true,
          ARCHIVE_APPLICATIONS: true,
          DASHBOARD_CUSTOMIZATION: true,
          AI_WORKSPACE: false
        }
      }
    },
    {
      plan: 'ELITE',
      monthlyPrice: 499.00,
      yearlyPrice: 4999.00,
      configuration: {
        limits: {
          APPLICATIONS: -1,
          RESUMES: -1,
          INTERVIEWS: -1,
          REMINDERS: -1,
          STORAGE: 10 * 1024 * 1024 * 1024, // 10 GB in bytes
          AI_ANALYSIS: 50,
          AI_MATCH: 50,
          AI_REWRITE: 30,
          AI_COVER_LETTER: 30,
          AI_INTERVIEW: 50,
          CAREER_INSIGHTS: 10
        },
        features: {
          BASIC_ANALYTICS: true,
          ADVANCED_ANALYTICS: true,
          EXPORT_PDF: true,
          EXPORT_CSV: true,
          RESUME_VERSION_HISTORY: true,
          CUSTOM_TAGS: true,
          ARCHIVE_APPLICATIONS: true,
          DASHBOARD_CUSTOMIZATION: true,
          AI_WORKSPACE: true
        }
      }
    }
  ];

  for (const item of plans) {
    const upserted = await prisma.planDefinition.upsert({
      where: { plan: item.plan },
      update: {
        monthlyPrice: item.monthlyPrice,
        yearlyPrice: item.yearlyPrice,
        configuration: item.configuration
      },
      create: {
        plan: item.plan,
        monthlyPrice: item.monthlyPrice,
        yearlyPrice: item.yearlyPrice,
        configuration: item.configuration
      }
    });
    console.log(`Seeded plan: ${upserted.plan}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
