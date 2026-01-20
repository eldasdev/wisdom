import { Article } from '../types';
import { mockAuthors } from './authors';

export const mockArticles: Article[] = [
  {
    id: 'strategy-execution-excellence',
    type: 'article',
    title: 'Achieving Strategy Execution Excellence',
    slug: 'strategy-execution-excellence',
    description: 'Why most companies fail to execute their strategies and how to bridge the strategy-to-performance gap.',
    authors: [mockAuthors[0]], // Michael Porter
    publishedAt: new Date('2024-01-15'),
    tags: ['strategy', 'execution', 'leadership', 'performance'],
    featured: true,
    category: 'Strategy & Execution',
    readTime: 12,
    wordCount: 3200,
    content: `# Achieving Strategy Execution Excellence

## The Strategy-to-Performance Gap

Despite decades of research and billions spent on strategic planning, most organizations continue to struggle with strategy execution. The gap between strategic intent and operational reality remains one of the most persistent challenges facing business leaders.

## Why Strategies Fail

Research shows that 60-70% of strategies fail during execution. The primary reasons include:

1. **Lack of clear priorities**: Organizations attempt to pursue too many initiatives simultaneously
2. **Insufficient resources**: Strategy execution requires dedicated resources and capabilities
3. **Poor communication**: Employees at all levels don't understand the strategy
4. **Inadequate measurement**: Organizations fail to track progress effectively
5. **Resistance to change**: Cultural and organizational barriers impede implementation

## Bridging the Gap

Successful strategy execution requires a systematic approach that addresses organizational capabilities, resource allocation, and performance measurement.

### Key Principles

- **Clarity of purpose**: Ensure every employee understands their role in strategy execution
- **Resource alignment**: Allocate resources to match strategic priorities
- **Performance measurement**: Track progress with relevant KPIs and metrics
- **Organizational alignment**: Align structure, processes, and culture with strategy
- **Leadership commitment**: Leaders must model the behavior they expect

## Conclusion

Strategy execution excellence is not an event but a continuous process that requires commitment, discipline, and systematic attention to organizational capabilities and performance measurement.`
  },
  {
    id: 'disruptive-innovation-healthcare',
    type: 'article',
    title: 'Disruptive Innovation in Healthcare',
    slug: 'disruptive-innovation-healthcare',
    description: 'How disruptive technologies are reshaping healthcare delivery and what leaders need to know.',
    authors: [mockAuthors[1]], // Clayton Christensen
    publishedAt: new Date('2024-02-01'),
    tags: ['innovation', 'healthcare', 'disruption', 'technology'],
    featured: true,
    category: 'Innovation & Technology',
    readTime: 15,
    wordCount: 4200,
    content: `# Disruptive Innovation in Healthcare

## The Healthcare Innovation Challenge

Healthcare represents one of the most complex and regulated industries, yet it faces unprecedented pressure for innovation. The convergence of technological advancement, demographic shifts, and rising costs creates both challenges and opportunities for disruptive innovation.

## Understanding Healthcare Disruption

Disruptive innovations in healthcare typically follow patterns observed in other industries:

1. **Sustaining innovations**: Improvements to existing solutions for current customers
2. **Disruptive innovations**: New solutions that initially serve niche markets but eventually displace established solutions

### Key Examples

- **Telemedicine**: Initially dismissed as inferior to in-person care, now transforming healthcare delivery
- **Wearable devices**: Democratizing health monitoring and enabling preventive care
- **AI diagnostics**: Improving accuracy and accessibility of medical diagnosis
- **Value-based care models**: Shifting from volume to value-based reimbursement

## Strategic Implications

Healthcare leaders must navigate several critical challenges:

### Regulatory Complexity

Healthcare disruption occurs within a heavily regulated environment where innovation must balance patient safety, data privacy, and clinical efficacy.

### Incumbent Resistance

Established healthcare organizations often resist disruptive innovations that threaten their business models, even as these innovations benefit patients and reduce costs.

### Integration Challenges

New technologies must integrate with existing healthcare infrastructure, requiring careful change management and stakeholder engagement.

## Leading Through Disruption

Successful healthcare innovation requires:

- **Patient-centric focus**: Innovations must ultimately improve patient outcomes
- **Collaborative ecosystems**: Partnerships between technology companies, healthcare providers, and payers
- **Regulatory engagement**: Working with regulators to create enabling environments
- **Talent development**: Building capabilities in digital health and data analytics

## The Future of Healthcare

The next decade will see continued disruption in healthcare delivery, with technology enabling more personalized, accessible, and efficient care. Organizations that embrace rather than resist these changes will be best positioned for long-term success.`
  },
  {
    id: 'psychological-safety-teams',
    type: 'article',
    title: 'The Power of Psychological Safety in High-Performing Teams',
    slug: 'psychological-safety-teams',
    description: 'How creating psychologically safe environments enables learning, innovation, and superior performance.',
    authors: [mockAuthors[2]], // Amy Edmondson
    publishedAt: new Date('2024-02-15'),
    tags: ['leadership', 'teams', 'psychological-safety', 'performance'],
    featured: false,
    category: 'Leadership & Teams',
    readTime: 10,
    wordCount: 2800,
    content: `# The Power of Psychological Safety in High-Performing Teams

## Beyond Technical Skills

While technical expertise and talent are important, research consistently shows that psychological safety is the most critical factor in team performance. Teams that feel safe to take interpersonal risks perform better, innovate more, and learn faster.

## What is Psychological Safety?

Psychological safety is a shared belief that the team is safe for interpersonal risk-taking. It exists when team members feel they can:

- Speak up with questions or concerns
- Admit mistakes without fear of punishment
- Offer ideas that might be unpopular
- Challenge the status quo constructively

## The Evidence

Extensive research across industries reveals compelling evidence:

### Google\'s Project Aristotle

Google\'s comprehensive study of team effectiveness found that psychological safety was the most important factor in high-performing teams, outweighing factors like individual intelligence, personality, and skill mix.

### Healthcare Outcomes

In surgical teams, psychologically safe environments correlate with:
- 50% reduction in postoperative complications
- Improved patient outcomes
- Faster error detection and correction

### Innovation Performance

Teams with high psychological safety generate 30-40% more innovative ideas and are more likely to implement those ideas successfully.

## Creating Psychological Safety

Leaders play a crucial role in establishing psychological safety:

### Lead by Example

- Admit your own mistakes and uncertainties
- Actively seek input from all team members
- Respond constructively to dissenting opinions

### Establish Clear Norms

- Define behavioral expectations explicitly
- Create structures for regular feedback
- Recognize and reward risk-taking behaviors

### Build Trust Through Vulnerability

- Share appropriate personal experiences
- Demonstrate empathy and understanding
- Create opportunities for team members to connect personally

## Measuring Psychological Safety

Organizations can assess psychological safety through:

- Anonymous surveys measuring perceived safety
- Observation of team interactions
- Analysis of error reporting and learning behaviors
- Employee engagement and retention metrics

## The Leadership Imperative

In an era of rapid change and increasing complexity, psychological safety is not a "nice-to-have" but a strategic imperative. Leaders who prioritize psychological safety create organizations that are more resilient, innovative, and capable of sustained high performance.

The challenge for leaders is not whether to invest in psychological safety, but how to do so effectively in their unique organizational context.`
  }
];