import { TeachingNote } from '../types';
import { mockAuthors } from './authors';

export const mockTeachingNotes: TeachingNote[] = [
  {
    id: 'netflix-case-teaching-notes',
    type: 'teaching-note',
    title: 'Teaching Note: Netflix: Disrupting the Entertainment Industry',
    slug: 'netflix-case-teaching-notes',
    description: 'Comprehensive teaching guide for the Netflix case study, including learning objectives, discussion questions, and implementation strategies.',
    authors: [mockAuthors[1]], // Clayton Christensen
    publishedAt: new Date('2024-01-25'),
    tags: ['teaching', 'case-method', 'disruption', 'entertainment'],
    featured: false,
    relatedContentId: 'netflix-disruption-entertainment',
    relatedContentType: 'case-study',
    objectives: [
      'Understand the principles of disruptive innovation in practice',
      'Analyze strategic pivots and business model transformation',
      'Examine competitive responses to industry disruption',
      'Evaluate timing and sequencing in business strategy'
    ],
    materials: [
      'Case study reading (15-20 minutes)',
      'PowerPoint slides with key frameworks',
      'Handout with discussion questions',
      'Financial exhibits and industry data',
      'Video clips from Netflix presentations (optional)'
    ],
    duration: 90,
    content: `# Teaching Note: Netflix: Disrupting the Entertainment Industry

## Overview

This case study examines Netflix's transformation from DVD rental service to global streaming powerhouse. It provides a comprehensive illustration of disruptive innovation theory in practice, making it ideal for courses in strategy, innovation, and entrepreneurship.

## Learning Objectives

By the end of this session, students should be able to:

1. **Apply disruptive innovation theory** to analyze real-world business transformations
2. **Evaluate strategic pivots** and the sequencing of business model changes
3. **Analyze competitive responses** to disruptive threats
4. **Assess the role of timing** in successful business model innovation
5. **Understand capability development** during industry transitions

## Case Positioning

### Course Context
- Strategy courses: Business model innovation and competitive advantage
- Innovation courses: Practical application of disruptive innovation theory
- Entrepreneurship courses: Scaling disruptive businesses
- Technology management: Technology-driven industry transformation

### Module Placement
- Early in strategy courses to introduce competitive dynamics
- Mid-term in innovation courses after theoretical foundations
- Capstone in entrepreneurship courses for real-world application

## Teaching Plan

### Pre-Class Preparation (Student Assignment)
- Read the case study (prepare 2-3 page memo with analysis)
- Review Netflix's current financial performance
- Research one competitor's response to Netflix's disruption

### Class Structure (90 minutes)

#### Opening (15 minutes)
- Brief lecture on disruptive innovation theory
- Student poll: "What companies do you think are currently disrupting industries?"
- Connect theory to Netflix case

#### Case Discussion (50 minutes)
- **DVD Era Analysis** (15 minutes): Why was Netflix successful initially?
- **Streaming Pivot** (15 minutes): What were the key strategic decisions?
- **Content Creation** (10 minutes): Vertical integration implications
- **Competitive Response** (10 minutes): Industry impact and responses

#### Integration and Extensions (25 minutes)
- Connect back to theoretical frameworks
- Discuss current challenges and future strategy
- Application to other industries

## Key Discussion Questions

### Strategic Analysis
1. **Initial Success**: How did Netflix achieve competitive advantage in the DVD rental market? What were the key success factors?

2. **Disruptive Recognition**: When did Netflix recognize streaming as a disruptive technology? How did they respond?

3. **Business Model Evolution**: Trace Netflix's business model changes from 1997 to present. What was the sequencing of these changes?

4. **Capability Development**: What new capabilities did Netflix need to develop? How did they manage the transition?

### Industry and Competition
5. **Competitive Response**: How did traditional media companies respond to Netflix's disruption? What worked and what didn't?

6. **Industry Impact**: How has Netflix changed the entertainment industry? What are the broader implications?

7. **Current Competition**: How should Netflix respond to new competitors like Disney+ and HBO Max?

### Leadership and Organization
8. **Leadership Decisions**: What role did Reed Hastings play in Netflix's success? What leadership qualities were critical?

9. **Organizational Culture**: How did Netflix build a culture that supported continuous innovation?

10. **Risk Management**: What were the biggest risks Netflix took? How did they manage these risks?

## Analytical Frameworks

### Primary Framework: Disruptive Innovation
- **Sustaining vs. Disruptive Innovation**: Map Netflix's innovations
- **Disruption Timeline**: Track the progression from niche to mainstream
- **Incumbent Response Patterns**: Analyze Blockbuster and other traditional players

### Secondary Frameworks
- **Business Model Canvas**: Evolution of Netflix's business model
- **Five Forces Analysis**: How disruption changed industry structure
- **Resource-Based View**: Netflix's capability development
- **Blue Ocean Strategy**: Creating new market spaces

## Common Student Challenges

### Misunderstanding Disruption
- **Issue**: Students focus on Netflix's current dominance rather than its disruptive journey
- **Solution**: Emphasize the initial inferiority of streaming technology and gradual improvement

### Technology Determinism
- **Issue**: Students attribute success purely to technology
- **Solution**: Highlight business model innovation, timing, and execution

### Hindsight Bias
- **Issue**: "Netflix was bound to succeed" thinking
- **Solution**: Discuss the many failures and uncertainties Netflix faced

## Teaching Tips

### Engage Students
- **Personal Connection**: Ask students about their Netflix usage and viewing habits
- **Current Events**: Connect to recent Netflix announcements or competitor moves
- **Debate Format**: Have students debate whether Netflix is still disruptive

### Manage Discussion
- **Break into Groups**: Use breakout rooms for deeper analysis
- **Cold Calling**: Ensure broad participation
- **Time Management**: Allocate specific time slots for each section

### Enhance Learning
- **Multimedia**: Show Netflix commercials or Hastings' presentations
- **Data Analysis**: Have students analyze Netflix's financial performance
- **Extension**: Discuss potential future disruptions to streaming

## Assessment and Evaluation

### Individual Assessment
- **Case Memo**: 2-3 page analysis due before class
- **Participation**: Contribution to class discussion
- **Reflection**: Post-class reflection on key learnings

### Group Assessment
- **Industry Analysis**: Apply frameworks to another industry
- **Strategy Development**: Develop disruption strategy for a company

## Extension Opportunities

### Related Cases
- **Blockbuster's Response**: Examine the incumbent perspective
- **Disney+ Launch**: Compare different disruption strategies
- **Spotify**: Music industry disruption parallels

### Advanced Topics
- **Platform Strategy**: Netflix as a platform business
- **Global Expansion**: International market entry strategies
- **Content Strategy**: Original content vs. licensing decisions

## Instructor Resources

### Slides
- Key frameworks and exhibits
- Industry timeline
- Financial analysis
- Discussion questions

### Handouts
- Case summary and key facts
- Framework templates
- Additional readings

### Video Resources
- Netflix culture presentation
- Industry analyst presentations
- Reed Hastings interviews

## Learning Outcomes Assessment

Students will demonstrate understanding by:
- Correctly applying disruptive innovation theory to the Netflix case
- Analyzing the sequencing and timing of strategic changes
- Evaluating competitive responses and industry impacts
- Developing strategies for managing disruption

## Updates and Revisions

This teaching note should be updated annually to reflect:
- Netflix's latest financial performance
- New competitive developments
- Changes in the streaming industry
- Student feedback on case effectiveness

## Conclusion

The Netflix case provides rich material for teaching disruptive innovation and strategic transformation. Its combination of clear theoretical application, engaging narrative, and current relevance makes it highly effective for developing students' strategic thinking and innovation capabilities.`
  },
  {
    id: 'amazon-culture-teaching-notes',
    type: 'teaching-note',
    title: 'Teaching Note: Amazon: Building a High-Performance Culture',
    slug: 'amazon-culture-teaching-notes',
    description: 'Teaching guide for the Amazon culture case, focusing on leadership principles, organizational culture, and performance management.',
    authors: [mockAuthors[3]], // John Kotter
    publishedAt: new Date('2024-02-12'),
    tags: ['teaching', 'leadership', 'culture', 'performance'],
    featured: false,
    relatedContentId: 'amazon-leadership-culture',
    relatedContentType: 'case-study',
    objectives: [
      'Understand the role of leadership principles in organizational culture',
      'Analyze mechanisms for building and sustaining high-performance cultures',
      'Evaluate the balance between innovation and operational excellence',
      'Examine challenges of scaling organizational culture'
    ],
    materials: [
      'Case study reading (20-25 minutes)',
      'Amazon Leadership Principles document',
      'Culture assessment survey',
      'Performance management examples',
      'Leadership development exercises'
    ],
    duration: 75,
    content: `# Teaching Note: Amazon: Building a High-Performance Culture

## Overview

This case study examines Amazon's distinctive leadership culture and its role in the company's success. It provides insights into how leadership principles shape organizational behavior and how companies can build cultures that drive exceptional performance.

## Learning Objectives

Students should be able to:

1. **Analyze leadership principles** and their impact on organizational culture
2. **Evaluate culture-building mechanisms** including hiring, performance management, and development
3. **Assess the balance** between innovation, customer focus, and operational excellence
4. **Understand scaling challenges** in maintaining culture during growth
5. **Apply culture concepts** to their own organizational contexts

## Case Positioning

### Course Context
- **Organizational Behavior**: Culture, leadership, and performance
- **Strategic Management**: Culture as competitive advantage
- **Human Resources**: Talent management and organizational development
- **Leadership**: Leadership principles and their implementation

### Module Placement
- Mid-term in OB courses after basic culture concepts
- Early in leadership courses to introduce principle-based leadership
- Capstone in strategy courses for culture-strategy alignment

## Teaching Plan

### Pre-Class Preparation
- Read the case and review Amazon's leadership principles
- Reflect on personal experiences with high-performance cultures
- Research Amazon's recent culture-related initiatives

### Class Structure (75 minutes)

#### Opening (10 minutes)
- Quick poll: "What companies have distinctive cultures?"
- Brief overview of culture's role in performance
- Connect to Amazon's approach

#### Case Discussion (45 minutes)
- **Leadership Principles** (15 minutes): Analysis and application
- **Implementation Mechanisms** (15 minutes): Hiring, performance, development
- **Cultural Challenges** (10 minutes): Work-life balance, diversity, innovation balance
- **Scaling Issues** (5 minutes): Maintaining culture during growth

#### Integration (20 minutes)
- Compare with other high-performance cultures
- Discuss applicability to different contexts
- Personal leadership development

## Key Discussion Questions

### Leadership Principles
1. **Principle Analysis**: Which Amazon leadership principles are most important? Why?
2. **Personal Assessment**: Which principles resonate with you? Which challenge you?
3. **Application**: How would you apply these principles in different contexts?

### Culture Building
4. **Hiring Process**: How does Amazon's "bar raiser" system work? What are its strengths and weaknesses?
5. **Performance Management**: Is "rank and yank" an effective performance management approach?
6. **Leadership Development**: How does Amazon develop leaders at scale?

### Cultural Challenges
7. **Work-Life Balance**: How should Amazon address criticism about work culture?
8. **Diversity & Inclusion**: What progress has Amazon made? What challenges remain?
9. **Innovation vs. Efficiency**: How does Amazon balance these competing priorities?

### Scaling and Sustainability
10. **Culture Scaling**: How can companies maintain culture during rapid growth?
11. **Sustainability**: Is Amazon's culture sustainable long-term? Why or why not?

## Analytical Frameworks

### Primary Framework: Organizational Culture Model
- **Artifacts**: Visible manifestations (leadership principles posters, meetings)
- **Espoused Values**: Stated principles and beliefs
- **Underlying Assumptions**: Deeply held beliefs about leadership and performance

### Secondary Frameworks
- **Competing Values Framework**: Balancing different cultural orientations
- **Cultural Web**: Amazon's cultural paradigms, rituals, and symbols
- **Leadership Grid**: Blake-Mouton managerial grid analysis

## Common Student Challenges

### Principle Overload
- **Issue**: Students overwhelmed by 16 principles
- **Solution**: Group into themes (customer, innovation, ownership, etc.)

### Amazon Bias
- **Issue**: Students either love or hate Amazon's approach
- **Solution**: Encourage balanced analysis of benefits and costs

### Contextual Differences
- **Issue**: Assuming Amazon's culture works everywhere
- **Solution**: Discuss contingency factors and adaptation needs

## Teaching Tips

### Interactive Elements
- **Principle Sort**: Have students categorize and prioritize principles
- **Culture Assessment**: Use surveys to assess current organizational cultures
- **Role Play**: Simulate Amazon-style meetings or decision-making

### Diverse Perspectives
- **Critics vs. Supporters**: Present both positive and negative views
- **Context Matters**: Discuss how culture works in different industries
- **Personal Values**: Connect to students' own leadership philosophies

### Application Focus
- **Self-Reflection**: How would students adapt Amazon's approach?
- **Case Comparisons**: Compare with other companies (Google, Netflix, etc.)
- **Implementation Planning**: Develop culture change plans

## Assessment

### Individual
- **Culture Analysis**: Apply frameworks to Amazon or another company
- **Leadership Self-Assessment**: Evaluate personal leadership against principles
- **Implementation Plan**: Design culture-building approach for an organization

### Group
- **Culture Audit**: Assess and recommend improvements for a real organization
- **Principle Adaptation**: Modify Amazon principles for different contexts

## Extensions

### Related Topics
- **Culture Change**: Kotter's 8-step model applied to Amazon
- **Ethical Leadership**: Balancing performance with employee well-being
- **Digital Culture**: How technology enables cultural reinforcement

### Advanced Applications
- **Cross-Cultural Issues**: Amazon's culture in international contexts
- **Culture Metrics**: How to measure culture and its impact
- **Leadership Transitions**: Bezos to Jassy leadership changes

## Instructor Resources

### Materials
- Amazon Leadership Principles (full document)
- Culture assessment tools
- Video clips of Amazon culture presentations
- Research articles on Amazon's culture

### Exercises
- Leadership principle prioritization
- Culture mapping exercises
- Performance management simulations

## Learning Outcomes

Students will be able to:
- Articulate how leadership principles shape organizational behavior
- Analyze culture-building mechanisms and their effectiveness
- Evaluate cultural trade-offs and challenges
- Apply culture concepts to organizational improvement

## Updates Needed

Annual updates should include:
- Changes in Amazon's leadership team
- New diversity and inclusion initiatives
- Cultural evolution under new CEO
- Employee satisfaction survey results
- Legal developments related to culture

## Conclusion

The Amazon culture case provides a rich platform for discussing leadership, culture, and organizational performance. Its blend of clear principles, measurable outcomes, and real challenges makes it highly effective for developing students' understanding of how culture drives business success.`
  }
];