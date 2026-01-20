import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create superadmin user
  const hashedPassword = await hash('admin123', 12);

  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@wisdom.com' },
    update: {},
    create: {
      email: 'admin@wisdom.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Superadmin user created:', superAdminUser.email);

  // Create superadmin author profile
  const superAdminAuthor = await prisma.author.upsert({
    where: { email: 'admin@wisdom.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@wisdom.com',
      title: 'Platform Administrator',
      institution: 'Wisdom Publishing',
      bio: 'Super administrator of the Wisdom academic publishing platform.',
      website: 'https://wisdom.com',
    },
  });

  console.log('✅ Superadmin author profile created:', superAdminAuthor.name);

  // Create some sample tags
  const tags = [
    'Strategy',
    'Leadership',
    'Innovation',
    'Business',
    'Technology',
    'Management',
    'Finance',
    'Marketing',
    'Operations',
    'Entrepreneurship',
  ];

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }

  console.log('✅ Sample tags created');

  // Create sample content for testing
  const sampleArticle = await prisma.content.upsert({
    where: { slug: 'welcome-to-wisdom' },
    update: {},
    create: {
      type: 'ARTICLE',
      title: 'Welcome to Wisdom',
      slug: 'welcome-to-wisdom',
      description: 'An introduction to the Wisdom academic publishing platform.',
      content: `# Welcome to Wisdom

Welcome to the Wisdom academic publishing platform! This is a comprehensive platform for sharing academic and business insights, case studies, and research.

## Features

- **Articles**: In-depth analysis and research
- **Case Studies**: Real-world business challenges and solutions
- **Books**: Comprehensive works and publications
- **Collections**: Curated content for focused learning

## Getting Started

To get started, you can:

1. Browse existing content
2. Create an author account
3. Submit your own content
4. Join the academic community

We hope you enjoy exploring and contributing to Wisdom!`,
      publishedAt: new Date(),
      status: 'PUBLISHED',
      featured: true,
      authors: {
        create: {
          authorId: superAdminAuthor.id,
        },
      },
      tags: {
        create: [
          { tagId: (await prisma.tag.findUnique({ where: { name: 'Business' } }))!.id },
          { tagId: (await prisma.tag.findUnique({ where: { name: 'Leadership' } }))!.id },
        ],
      },
    },
  });

  console.log('✅ Sample content created:', sampleArticle.title);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Superadmin Credentials:');
  console.log('Email: admin@wisdom.com');
  console.log('Password: admin123');
  console.log('\n🔗 Login URL: http://localhost:3000/auth/signin');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });