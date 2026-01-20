import { Collection } from '../types';
import { mockAuthors } from './authors';

export const mockCollections: Collection[] = [
  {
    id: 'strategy-essentials-collection',
    type: 'collection',
    title: 'Strategy Essentials: Core Concepts and Frameworks',
    slug: 'strategy-essentials-collection',
    description: 'A curated collection of essential readings on competitive strategy, covering the foundational frameworks and concepts that every strategist should master.',
    authors: [mockAuthors[0]], // Michael Porter as curator
    publishedAt: new Date('2024-01-01'),
    tags: ['strategy', 'competition', 'frameworks', 'essentials'],
    featured: true,
    curator: mockAuthors[0],
    theme: 'Strategic Management Foundations',
    items: [
      {
        id: 'strategy-exec-intro',
        contentId: 'strategy-execution-excellence',
        contentType: 'article',
        order: 1,
        notes: 'Introduction to the strategy-to-performance gap and why execution matters'
      },
      {
        id: 'competitive-strategy-intro',
        contentId: 'five-forces-analysis-chapter',
        contentType: 'book-chapter',
        order: 2,
        notes: 'The foundational framework for industry analysis'
      },
      {
        id: 'netflix-strategy-case',
        contentId: 'netflix-disruption-entertainment',
        contentType: 'case-study',
        order: 3,
        notes: 'Real-world application of strategic frameworks in a disruptive context'
      },
      {
        id: 'amazon-culture-strategy',
        contentId: 'amazon-leadership-culture',
        contentType: 'case-study',
        order: 4,
        notes: 'How organizational culture enables strategy execution at scale'
      }
    ],
    content: `# Strategy Essentials: Core Concepts and Frameworks

## Why This Collection Matters

In an era of rapid technological change and increasing competition, strategic thinking has never been more important. Yet many managers struggle to apply strategic concepts effectively. This curated collection brings together the essential frameworks, concepts, and real-world applications that form the foundation of effective strategic management.

## Collection Overview

This collection is designed for:
- **Aspiring strategists** seeking to build foundational knowledge
- **Mid-level managers** looking to deepen their strategic thinking
- **Executives** wanting to refresh core concepts
- **Students** studying strategic management

## Learning Journey

The collection follows a logical progression from theory to practice:

### Part 1: Strategy Execution Fundamentals
Understanding why strategies fail and how to bridge the execution gap.

### Part 2: Competitive Analysis
Mastering the tools for analyzing industry structure and competitive positioning.

### Part 3: Real-World Application
Seeing strategic frameworks applied in disruptive business environments.

### Part 4: Organizational Implementation
Examining how culture and leadership enable strategy execution at scale.

## Key Themes

### The Strategy-to-Performance Gap
Most strategies fail not because they are poorly conceived, but because they are poorly executed. Understanding this gap is the first step toward effective strategy implementation.

### Industry Analysis
Before formulating strategy, managers must understand the competitive forces shaping their industry. The Five Forces framework provides a systematic approach to this analysis.

### Disruptive Innovation
In dynamic industries, managers must recognize when new technologies or business models threaten established positions.

### Organizational Alignment
Strategy requires more than analysis—it demands organizational capabilities, culture, and leadership commitment.

## Reading Guide

### Sequential Reading
Read the items in order for the best learning experience. Each piece builds on the previous ones.

### Time Commitment
- **Total reading time**: Approximately 3-4 hours
- **Deep study**: 6-8 hours including reflection and application

### Application Exercises
After each major section, pause to apply the concepts to your own organization or industry.

## Discussion Questions

1. **Strategy Execution**: What are the biggest barriers to strategy execution in your organization?
2. **Industry Analysis**: How would you apply the Five Forces framework to your industry?
3. **Disruption**: What disruptive threats does your organization face?
4. **Culture and Strategy**: How does your organization's culture support or hinder strategy execution?

## Additional Resources

### Complementary Readings
- Porter, M.E. (1996). "What is Strategy?" Harvard Business Review
- Christensen, C.M. (2006). "The Ongoing Process of Building a Theory of Disruption" Journal of Product Innovation Management

### Online Resources
- Harvard Business School Strategy Course
- INSEAD Strategy Faculty Research
- McKinsey Strategy Practice

## About the Curator

Michael E. Porter is the Bishop William Lawrence University Professor at Harvard Business School. He is a leading authority on competitive strategy and the competitiveness of nations and regions. His work has transformed how business leaders understand competition and develop strategy.

## Collection Updates

This collection is periodically updated to include new insights and applications. Subscribe to receive notifications of updates.

## How to Use This Collection

### Individual Study
- Read sequentially and take notes on key insights
- Apply frameworks to your current role or organization
- Discuss concepts with colleagues

### Group Learning
- Use as the basis for strategy discussion groups
- Assign different items to team members for presentations
- Develop group strategy projects using the frameworks

### Teaching
- Incorporate into strategy courses or executive education
- Use cases for classroom discussion and analysis

## Impact and Outcomes

Readers of this collection will be able to:
- Apply core strategic frameworks with confidence
- Analyze competitive environments systematically
- Identify strategic opportunities and threats
- Develop more effective strategies for their organizations
- Contribute more effectively to strategic discussions

## Connect with the Community

Join the discussion forum to connect with other readers, share applications, and learn from diverse perspectives.`
  },
  {
    id: 'innovation-disruption-collection',
    type: 'collection',
    title: 'Innovation and Disruption: Navigating Technological Change',
    slug: 'innovation-disruption-collection',
    description: 'Explore the dynamics of disruptive innovation through classic theory and contemporary case studies that show how established companies can adapt to technological change.',
    authors: [mockAuthors[1]], // Clayton Christensen as curator
    publishedAt: new Date('2024-02-01'),
    tags: ['innovation', 'disruption', 'technology', 'change-management'],
    featured: true,
    curator: mockAuthors[1],
    theme: 'Technological Innovation and Industry Transformation',
    items: [
      {
        id: 'disruptive-theory-intro',
        contentId: 'disruptive-innovation-theory-chapter',
        contentType: 'book-chapter',
        order: 1,
        notes: 'Foundational theory distinguishing sustaining from disruptive innovation'
      },
      {
        id: 'disruptive-innovation-article',
        contentId: 'disruptive-innovation-healthcare',
        contentType: 'article',
        order: 2,
        notes: 'Contemporary applications in healthcare innovation'
      },
      {
        id: 'netflix-disruption-case',
        contentId: 'netflix-disruption-entertainment',
        contentType: 'case-study',
        order: 3,
        notes: 'Complete disruption journey from niche to mainstream markets'
      },
      {
        id: 'psychological-safety-innovation',
        contentId: 'psychological-safety-teams',
        contentType: 'article',
        order: 4,
        notes: 'How team culture enables innovation and learning'
      }
    ],
    content: `# Innovation and Disruption: Navigating Technological Change

## Understanding the Innovation Challenge

In a world of accelerating technological change, the ability to innovate effectively has become a strategic imperative. Yet most organizations struggle with innovation, and many established companies fail despite significant investments in R&D. This collection explores why this happens and how organizations can navigate technological disruption successfully.

## Collection Structure

### Theoretical Foundations
Begin with the core concepts that explain why successful companies fail to innovate.

### Contemporary Applications
See how disruptive innovation plays out in modern industries and contexts.

### Real-World Case Studies
Examine complete disruption journeys from emergence to industry transformation.

### Organizational Enablers
Understand the cultural and team factors that enable successful innovation.

## Key Insights

### The Innovator's Dilemma
Established companies excel at sustaining innovations that serve existing customers but struggle with disruptive innovations that initially serve niche markets. This dilemma explains why industry leaders often fail to respond effectively to technological change.

### Patterns of Disruption
Disruptive innovations follow predictable patterns:
- They emerge in niche markets with initially inferior performance
- They improve along dimensions that mainstream customers eventually value
- They eventually displace established products and business models

### Organizational Responses
Successful adaptation requires:
- Separate organizations for disruptive businesses
- Different performance metrics and processes
- Willingness to cannibalize existing businesses
- Patient investment in emerging technologies

### Cultural Foundations
Innovation thrives in environments with:
- Psychological safety for risk-taking
- Diverse perspectives and constructive conflict
- Learning orientation rather than performance-only focus
- Tolerance for calculated experimentation

## Learning Objectives

By completing this collection, readers will be able to:

1. **Distinguish between sustaining and disruptive innovation**
2. **Identify early signals of disruptive threats**
3. **Analyze industry disruption patterns**
4. **Design organizational responses to technological change**
5. **Build cultures that support innovation**

## Reading Approach

### Progressive Complexity
The collection builds from theory to practice, starting with foundational concepts and moving to complex real-world applications.

### Application Focus
Each piece includes practical implications and questions for applying the concepts to your organization.

### Discussion Framework
Use the provided questions to facilitate group discussions or personal reflection.

## Target Audience

### Business Leaders
- Executives facing technological disruption
- Innovation managers and teams
- Strategy and corporate development professionals

### Entrepreneurs
- Founders navigating industry change
- Startup teams developing disruptive innovations
- Investors evaluating disruptive opportunities

### Academics and Students
- Researchers studying innovation and disruption
- Students of technology management and strategy
- Professors teaching innovation courses

## Time Investment

- **Core reading**: 4-5 hours
- **Deep study with exercises**: 8-10 hours
- **Group discussion and application**: 4-6 hours

## Discussion Questions

### Theoretical Understanding
1. How does disruptive innovation differ from sustaining innovation?
2. Why do successful companies struggle with disruption?
3. What are the predictable patterns of industry disruption?

### Practical Application
4. What disruptive threats does your organization face?
5. How well positioned is your organization to respond?
6. What organizational changes might be needed?

### Strategic Implications
7. How can established companies create space for disruptive innovation?
8. What role should acquisitions play in innovation strategy?
9. How can you balance investment in sustaining vs. disruptive opportunities?

## Related Resources

### Books
- Christensen, C.M. (1997). The Innovator's Dilemma
- Christensen, C.M. (2016). Competing Against Luck
- Anthony, S.D. (2012). The Little Black Book of Innovation

### Research
- Harvard Business School Disruptive Innovation Research
- Christensen Institute publications
- MIT Sloan innovation research

## About the Curator

Clayton Christensen is the Kim B. Clark Professor of Business Administration at Harvard Business School. He is widely regarded as the world's foremost authority on disruptive innovation and has fundamentally changed how business leaders understand innovation and competition.

## Collection Evolution

This collection evolves with new insights and case studies. Future updates will include:
- Emerging technologies and their disruptive potential
- New industry case studies
- Research on organizational adaptation to disruption
- Global perspectives on innovation and disruption

## Community Engagement

Connect with other readers through:
- Discussion forums for sharing insights
- Virtual meetups to discuss applications
- Curator Q&A sessions
- Application workshops

## Impact Goals

Readers will develop the ability to:
- Anticipate and respond to technological disruption
- Build organizations capable of continuous innovation
- Make better strategic decisions about technology investments
- Lead successful transformations in changing industries

## Implementation Support

For organizations interested in applying these concepts:
- Innovation assessment workshops
- Strategy facilitation for disruptive opportunities
- Culture change programs for innovation
- Executive education programs

This collection serves as both a learning resource and a practical guide for navigating the challenges and opportunities of technological disruption.`
  }
];