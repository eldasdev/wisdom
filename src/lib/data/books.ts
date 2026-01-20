import { Book, BookChapter } from '../types';
import { mockAuthors } from './authors';

export const mockBooks: Book[] = [
  {
    id: 'competitive-strategy-porter',
    type: 'book',
    title: 'Competitive Strategy: Techniques for Analyzing Industries and Competitors',
    slug: 'competitive-strategy-porter',
    description: 'The definitive guide to competitive strategy, introducing the Five Forces Framework and value chain analysis.',
    authors: [mockAuthors[0]], // Michael Porter
    publishedAt: new Date('1980-01-01'),
    updatedAt: new Date('1998-01-01'),
    tags: ['strategy', 'competition', 'industry-analysis', 'business'],
    featured: true,
    isbn: '978-0684841489',
    publisher: 'Free Press',
    pages: 416,
    edition: 1,
    chapters: ['five-forces-analysis-chapter'],
    content: `# Competitive Strategy

## The Structural Analysis of Industries

This seminal work introduces the Five Forces Framework for analyzing industry structure and competitive positioning. The framework examines the competitive forces that determine industry profitability and provides a systematic approach to strategic decision-making.

## The Five Forces Framework

Porter's Five Forces analysis considers:

1. **Threat of New Entrants**: Barriers to entry and expected retaliation from incumbents
2. **Bargaining Power of Suppliers**: Suppliers' ability to raise prices or reduce quality
3. **Bargaining Power of Buyers**: Buyers' ability to force down prices or demand higher quality
4. **Threat of Substitute Products**: Availability of alternative solutions
5. **Rivalry Among Existing Competitors**: Intensity of competition within the industry

## Generic Competitive Strategies

The book outlines three generic strategies for achieving competitive advantage:

### Cost Leadership
- Achieving the lowest costs in the industry
- Requires significant market share and economies of scale
- Vulnerable to technological changes and new entrants

### Differentiation
- Creating unique products or services valued by customers
- Requires strong marketing and innovation capabilities
- Can command premium pricing

### Focus
- Targeting a specific market segment or niche
- Can be cost-focused or differentiation-focused
- Requires deep understanding of target customers

## Value Chain Analysis

Porter introduces the value chain as a tool for understanding how a business creates customer value. The framework breaks down business activities into:

- **Primary Activities**: Inbound logistics, operations, outbound logistics, marketing & sales, service
- **Support Activities**: Procurement, technology development, human resource management, firm infrastructure

## Strategic Positioning

The book emphasizes that sustainable competitive advantage comes from:
- Creating value for customers
- Having a clear strategic position
- Making trade-offs that reinforce the chosen strategy
- Continuously improving and adapting

## Industry Evolution

Porter discusses how industries evolve through predictable stages:
- **Emergence**: High uncertainty, entrepreneurial activity
- **Growth**: Rapid expansion, standardization
- **Shakeout**: Consolidation, exit of weaker competitors
- **Maturity**: Slow growth, emphasis on efficiency
- **Decline**: Shrinking demand, strategic exit decisions

## Implementation Considerations

Successful strategy implementation requires:
- Organizational alignment with chosen strategy
- Appropriate resource allocation
- Performance measurement systems
- Leadership commitment

## Enduring Impact

Published in 1980, Competitive Strategy remains one of the most influential business books ever written. Its frameworks continue to guide strategic thinking in organizations worldwide, providing timeless insights into competitive dynamics and strategic positioning.`
  },
  {
    id: 'disruptive-innovation-christensen',
    type: 'book',
    title: 'The Innovator\'s Dilemma: When New Technologies Cause Great Firms to Fail',
    slug: 'disruptive-innovation-christensen',
    description: 'Why successful companies fail to innovate and how to avoid the innovator\'s dilemma.',
    authors: [mockAuthors[1]], // Clayton Christensen
    publishedAt: new Date('1997-01-01'),
    updatedAt: new Date('2016-01-01'),
    tags: ['innovation', 'disruption', 'technology', 'strategy'],
    featured: true,
    isbn: '978-1633691780',
    publisher: 'Harvard Business Review Press',
    pages: 336,
    edition: 1,
    chapters: ['disruptive-innovation-theory-chapter'],
    content: `# The Innovator\'s Dilemma

## Why Great Companies Fail

Clayton Christensen's groundbreaking work explains why successful, well-managed companies can fail by doing everything right. The innovator's dilemma occurs when established companies focus on sustaining innovations that serve their best customers while ignoring disruptive innovations that initially serve niche markets.

## Sustaining vs. Disruptive Innovation

### Sustaining Innovations
- Improve performance along established dimensions
- Serve existing customers better
- Generate higher profits for incumbents
- Maintain competitive advantage

### Disruptive Innovations
- Initially inferior performance along traditional metrics
- Serve emerging or niche markets initially
- Eventually displace established products/services
- Create new markets and value networks

## The Dilemma

Successful companies face a dilemma because:

1. **Resource Allocation**: Profits from sustaining innovations fund R&D, leaving limited resources for disruptive projects
2. **Customer Focus**: Companies listen to current customers who don't want disruptive innovations
3. **Organizational Capabilities**: Existing processes and values are optimized for sustaining innovation
4. **Performance Metrics**: Success metrics are defined by sustaining innovation standards

## Case Studies

Christensen examines how disruption played out in several industries:

### Disk Drives
- How smaller drives disrupted larger ones
- The pattern of disruption in component technologies
- The role of new entrants vs. incumbents

### Excavators
- Mechanical excavators disrupted cable-operated machines
- The importance of understanding customer needs
- How incumbents failed to respond

### Steel Industry
- Mini-mills disrupted integrated steel producers
- The role of cost structure in competitive advantage
- The importance of business model innovation

## Organizational Responses

### Failed Responses
- Most incumbents ignore disruptive threats
- Some attempt to compete in new markets but fail
- Others acquire disruptive companies but struggle to integrate them

### Successful Responses
- Create separate organizations for disruptive businesses
- Maintain separate performance metrics and processes
- Allow disruptive businesses to cannibalize sustaining businesses

## Strategic Implications

### For Established Companies
- Actively monitor emerging technologies and business models
- Create organizational structures that support disruptive innovation
- Balance resource allocation between sustaining and disruptive activities
- Be willing to cannibalize existing businesses

### For New Entrants
- Target non-traditional customers initially
- Focus on performance attributes that incumbents over-serve
- Scale up as technology and business models mature
- Create new value networks

## The Role of Technology

Christensen distinguishes between:
- **Performance-improving technologies**: Enable better products for existing customers
- **Enabling technologies**: Create new applications and markets
- **Disruptive technologies**: Initially underperform but improve rapidly

## Managerial Lessons

1. **Don't listen only to customers**: They can only tell you about sustaining innovations
2. **Invest in emerging technologies**: Even if they don't serve current markets
3. **Create separate organizations**: For disruptive businesses to flourish
4. **Watch for signals of disruption**: New entrants, new applications, new business models
5. **Be patient**: Disruption takes time to unfold

## Enduring Relevance

Published in 1997, The Innovator's Dilemma has become a cornerstone of strategic thinking. Its insights explain why industry leaders like Kodak, Blockbuster, and Nokia failed despite their strengths. The framework continues to help managers navigate technological change and industry disruption.`
  }
];

export const mockBookChapters: BookChapter[] = [
  {
    id: 'five-forces-analysis-chapter',
    type: 'book-chapter',
    title: 'The Five Competitive Forces That Shape Strategy',
    slug: 'five-forces-analysis-chapter',
    description: 'Detailed analysis of the five forces framework and its application to strategic decision-making.',
    authors: [mockAuthors[0]], // Michael Porter
    publishedAt: new Date('1980-01-01'),
    tags: ['strategy', 'competition', 'analysis'],
    featured: false,
    bookId: 'competitive-strategy-porter',
    chapterNumber: 1,
    pageRange: '3-32',
    content: `# The Five Competitive Forces That Shape Strategy

## Introduction

The essence of strategy formulation is coping with competition. Yet it is easy to view competition too narrowly and too pessimistically. While one sometimes hears executives complaining about how competitors are "beating our prices down" or "stealing our customers," the competitive forces go beyond current rivals. To establish a strategic agenda for dealing with competition, we must look beyond the immediate rivals and analyze the underlying drivers of profitability.

## The Five Forces Framework

The five forces determine the profit potential of an industry by analyzing:
1. The threat of new entrants
2. The bargaining power of suppliers
3. The bargaining power of buyers
4. The threat of substitute products or services
5. The rivalry among existing competitors

## 1. Threat of New Entrants

New entrants bring new capacity and a desire to gain market share. The seriousness of the threat depends on:

### Barriers to Entry
- **Economies of scale**: Cost advantages from large-scale operations
- **Product differentiation**: Brand loyalty and customer switching costs
- **Capital requirements**: Financial resources needed to enter
- **Access to distribution channels**: Availability of retail outlets or distribution networks
- **Cost disadvantages independent of scale**: Proprietary technology, favorable access to raw materials
- **Government policy**: Tariffs, regulations, or other government restrictions

### Expected Retaliation
- Incumbents may respond aggressively to new entrants through price cuts, increased advertising, or capacity expansion

## 2. Bargaining Power of Suppliers

Suppliers can exert power by raising prices or reducing quality. Powerful suppliers can squeeze profitability out of an industry that is unable to pass on cost increases.

### Factors Determining Supplier Power
- **Supplier concentration**: Few suppliers dominate the industry
- **Switching costs**: Costs to switch from one supplier to another
- **Forward integration threat**: Suppliers might enter the buyer's industry
- **Importance of buyer to supplier**: How much the supplier depends on the buyer
- **Differentiation of inputs**: Unique or differentiated supplier products
- **Substitutes available**: Alternative inputs or suppliers

## 3. Bargaining Power of Buyers

Buyers compete with the industry by forcing down prices, demanding better quality or more service, and playing competitors against each other.

### Factors Determining Buyer Power
- **Buyer concentration**: Few buyers account for large purchases
- **Purchase volume**: Buyers purchase large volumes relative to seller sales
- **Switching costs**: Costs to switch from one supplier to another
- **Buyer information**: Buyers have good information about demand, actual costs, etc.
- **Backward integration threat**: Buyers might enter the supplier's industry
- **Substitutes available**: Alternative products available to buyers

## 4. Threat of Substitute Products

Substitutes limit the potential returns of an industry by placing a ceiling on the prices that firms can charge.

### Types of Substitutes
- **Direct substitutes**: Products that perform the same function
- **Indirect substitutes**: Products that serve different functions but satisfy the same underlying need

### Factors Affecting Substitution Threat
- **Relative price/performance**: How close substitutes come to matching industry products
- **Switching costs**: Costs for customers to switch to substitutes
- **Buyer propensity to substitute**: Willingness of buyers to switch

## 5. Rivalry Among Existing Competitors

Competition among existing firms takes many forms: price discounting, new product introductions, advertising campaigns, and service improvements.

### Factors Intensifying Rivalry
- **Numerous or equally balanced competitors**: Many firms of similar size
- **Slow industry growth**: Firms fight for market share in stagnant markets
- **High fixed or storage costs**: Pressure to utilize capacity
- **Lack of differentiation**: Commoditized products with few switching costs
- **Capacity augmentation**: Frequent additions to capacity
- **Diverse competitors**: Firms with different strategies, origins, or personalities
- **High strategic stakes**: Important to competitors' long-term strategies
- **High exit barriers**: Economic, strategic, or emotional factors making exit difficult

## Strategic Implications

The five forces framework reveals whether an industry is attractive or unattractive. Industries with high barriers to entry, weak suppliers and buyers, few substitutes, and limited rivalry offer the best profit potential.

### Positioning Within Industries
- Identify which forces are most important in your industry
- Develop strategies to influence those forces in your favor
- Choose positions that expose you to the least competitive pressure

### Industry Evolution
- Forces change over time as industry conditions evolve
- Monitor changes in the five forces
- Adjust strategy as the industry structure changes

## Conclusion

The five forces framework provides a systematic way to analyze industry structure and competitive positioning. By understanding these forces, managers can identify opportunities for improving industry attractiveness and choose strategies that position their companies for sustainable competitive advantage.`
  },
  {
    id: 'disruptive-innovation-theory-chapter',
    type: 'book-chapter',
    title: 'What is Disruptive Innovation?',
    slug: 'disruptive-innovation-theory-chapter',
    description: 'Defining disruptive innovation and distinguishing it from sustaining innovation.',
    authors: [mockAuthors[1]], // Clayton Christensen
    publishedAt: new Date('1997-01-01'),
    tags: ['innovation', 'disruption', 'technology'],
    featured: false,
    bookId: 'disruptive-innovation-christensen',
    chapterNumber: 1,
    pageRange: '15-42',
    content: `# What is Disruptive Innovation?

## The Discovery of Disruptive Innovation

In the early 1990s, while studying the disk drive industry, I observed a pattern that defied conventional wisdom. Successful companies were failing not because they were doing anything wrong, but because they were doing everything right. They were listening to their customers, investing in the technologies their customers wanted, and executing flawlessly. Yet they were still losing market share to companies that seemed to be doing everything wrong.

## Sustaining vs. Disruptive Technologies

### Sustaining Technologies
Sustaining technologies improve the performance of established products along the dimensions that mainstream customers in major markets have historically valued.

**Characteristics:**
- Improve performance along established metrics
- Serve existing customers better
- Generate higher profits for incumbents
- Maintain or extend competitive advantage

**Examples:**
- Faster microprocessors in computers
- Higher resolution displays in televisions
- Improved fuel efficiency in automobiles

### Disruptive Technologies
Disruptive technologies bring to a market a very different value proposition than had been available previously. They either:

1. Create new markets by serving previously unserved customer needs
2. Reshape existing markets by displacing established competitors

**Characteristics:**
- Initially underperform along traditional metrics
- Serve emerging or niche markets initially
- Eventually improve to displace established products
- Create new value networks

## The Pattern of Disruption

### Stage 1: Emergence
- New technology appears, initially serving niche markets
- Performance is inferior along traditional dimensions
- Mainstream customers are not interested
- Incumbents ignore the new technology

### Stage 2: Improvement
- Technology improves along relevant performance dimensions
- Begins to serve mainstream customers
- Still may be inferior on some traditional metrics
- Incumbents begin to notice but often respond inadequately

### Stage 3: Takeover
- Technology surpasses traditional performance metrics
- Displaces established products in mainstream markets
- Incumbents struggle to respond effectively
- New entrants dominate the industry

## Why Incumbents Fail

### Listening to Customers
Incumbents focus on sustaining innovations that serve their best customers. Customers can only tell you about sustaining innovations—they cannot tell you about disruptive innovations because they don't know what they don't know.

### Resource Allocation
Profits from sustaining innovations fund R&D investments. Limited resources are available for disruptive projects that don't serve current customers.

### Organizational Processes
Companies develop processes, values, and capabilities optimized for sustaining innovation. These same processes make it difficult to pursue disruptive opportunities.

### Performance Metrics
Success is measured by sustaining innovation standards. Disruptive projects often look like failures when evaluated by these metrics.

## Case Study: Disk Drive Industry

### The Pattern
- 14-inch drives were disrupted by 8-inch drives
- 8-inch drives were disrupted by 5.25-inch drives
- 5.25-inch drives were disrupted by 3.5-inch drives
- Each generation of smaller drives initially served niche applications

### Why Incumbents Failed
- Focused on improving performance of larger drives for existing customers
- Smaller drives initially had lower capacity and performance
- Incumbents viewed smaller drives as inferior products
- New entrants were not constrained by existing customer relationships

## Implications for Managers

### Don't Listen Only to Customers
Customers are important, but they can only guide sustaining innovation. Managers must actively seek disruptive opportunities.

### Create Separate Organizations
Disruptive businesses require different processes, values, and capabilities than sustaining businesses.

### Watch for Signals of Disruption
- New technologies that initially underperform
- New market applications
- New business models
- New entrants targeting niche markets

### Be Patient
Disruption takes time. Initial failures don't mean the technology is flawed.

## Redefining Innovation

The discovery of disruptive innovation challenged the conventional wisdom that successful companies should focus on their best customers and invest in the technologies they request. Instead, managers must balance attention to sustaining innovations with proactive pursuit of disruptive opportunities.

This understanding has profound implications for how companies organize for innovation, allocate resources, and compete in changing markets.`
  }
];