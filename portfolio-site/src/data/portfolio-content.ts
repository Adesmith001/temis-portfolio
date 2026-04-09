import type { PortfolioContent } from '../types/portfolio'

export const defaultPortfolioContent: PortfolioContent = {
  profile: {
    name: 'Temilade Somade',
    role: 'Data Analyst + BI Specialist',
    headline: 'I turn business data into strategy leaders can act on immediately.',
    intro:
      'From SQL warehouse architecture to executive Tableau dashboards, I design analytics systems that make decision-making faster, clearer, and measurable.',
    contactEmail: 'somadetemilade16@gmail.com',
    linkedInUrl: 'https://www.linkedin.com/in/somade-temilade-8b95a8236?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    tableauProfileUrl: 'https://public.tableau.com/app/profile/temilade.somade/vizzes',
  },
  skills: [
    {
      id: 'analytics-engineering',
      title: 'Analytics Engineering',
      items: [
        'SQL Server',
        'Data Modeling',
        'ETL Pipelines',
        'Medallion Architecture',
      ],
    },
    {
      id: 'business-intelligence',
      title: 'Business Intelligence',
      items: [
        'Tableau Desktop',
        'Interactive Dashboards',
        'KPI Design',
        'YoY Trend Analysis',
      ],
    },
    {
      id: 'analytical-thinking',
      title: 'Analytical Thinking',
      items: [
        'Customer Segmentation',
        'Performance Benchmarking',
        'Stakeholder Storytelling',
        'Decision Support Analytics',
      ],
    },
  ],
  projects: [
    {
      slug: 'sql-modern-warehouse',
      projectType: 'sql',
      title: 'Modern Data Warehouse Architecture for Scalable Business Intelligence',
      summary:
        'Designed and implemented a SQL Server medallion architecture that transforms raw ERP/CRM data into analytics-ready dimensional models.',
      role: 'Data Analyst & BI Specialist',
      period: '2026',
      tools: ['SQL Server', 'SSMS', 'T-SQL', 'Draw.io', 'GitHub'],
      tags: ['Data Warehousing', 'ETL', 'Medallion Architecture', 'Star Schema'],
      heroImage: '/projects/sql-modern-warehouse.svg',
      metrics: [
        {
          label: 'Source Systems Unified',
          value: '2',
          delta: 'ERP + CRM integrated',
          trend: 'up',
        },
        {
          label: 'Architecture Layers',
          value: '3',
          delta: 'Bronze, Silver, Gold',
          trend: 'up',
        },
        {
          label: 'Analytical Output',
          value: 'Business-Ready',
          delta: 'Fact + dimension model delivered',
          trend: 'up',
        },
      ],
      links: {
        github: 'https://github.com/SomadeTemilade1/sql-modern-warehouse-project',
      },
      caseStudy: {
        problem: [
          'Business data lived in disconnected source systems, making reporting inconsistent and slow.',
          'Stakeholders had no single analytical model for decision-ready querying.',
        ],
        approach: [
          'Built a medallion architecture in SQL Server to stage raw, cleaned, and analytics-ready layers.',
          'Implemented ETL scripts to cleanse and normalize incoming ERP and CRM records.',
          'Modeled gold-layer fact and dimension tables for scalable BI querying.',
        ],
        insights: [
          'Layered architecture improved data traceability from source ingestion to report consumption.',
          'Dimensional modeling made downstream KPI reporting easier and faster to maintain.',
        ],
        impact: [
          'Delivered a reusable data foundation that improves reporting efficiency and accessibility.',
          'Enabled business teams to move from fragmented reporting to consistent decision support.',
        ],
      },
    },
    {
      slug: 'sql-advanced-analytics',
      projectType: 'sql',
      title: 'Advanced SQL Analytics for Business Insights and Decision Support',
      summary:
        'Applied advanced SQL analytics on curated warehouse data to generate customer, product, and trend intelligence for strategic decisions.',
      role: 'Data Analyst & BI Specialist',
      period: '2026',
      tools: ['SQL Server', 'SSMS', 'T-SQL', 'GitHub'],
      tags: ['Advanced SQL', 'Window Functions', 'Segmentation', 'KPI Analytics'],
      heroImage: '/projects/sql-advanced-analytics.svg',
      metrics: [
        {
          label: 'Analytical Focus Areas',
          value: '3',
          delta: 'Customers, products, sales trends',
          trend: 'up',
        },
        {
          label: 'Query Depth',
          value: 'Advanced',
          delta: 'Window functions + time-series analysis',
          trend: 'up',
        },
        {
          label: 'Decision Output',
          value: 'Business-Ready',
          delta: 'Actionable KPI reporting',
          trend: 'up',
        },
      ],
      links: {
        github: 'https://github.com/SomadeTemilade1/Sql_data_analytics_project',
      },
      caseStudy: {
        problem: [
          'Leaders needed deeper operational intelligence than standard aggregate reports could provide.',
          'Customer and product performance patterns were hidden in transactional-level data.',
        ],
        approach: [
          'Built analytical SQL scripts for segmentation, time-series tracking, and performance benchmarking.',
          'Structured query outputs into repeatable reports aligned to stakeholder decisions.',
        ],
        insights: [
          'Windowed analysis exposed trend and ranking patterns difficult to detect with static summaries.',
          'Segment-based query outputs clarified where profitability and customer value concentrate.',
        ],
        impact: [
          'Turned warehouse data into recurring analytical outputs that support faster strategic decisions.',
          'Created a reusable SQL analytics library for ongoing BI work.',
        ],
      },
    },
    {
      slug: 'sales-customer-intelligence-dashboard',
      projectType: 'tableau',
      title: 'Sales & Customer Intelligence Dashboard',
      summary:
        'Built a dual-view Tableau dashboard that gives sales leadership real-time visibility into revenue performance and customer behavior.',
      role: 'Data Analyst & BI Specialist',
      period: '2023 - 2024',
      tools: ['Tableau Desktop', 'LOD Expressions', 'Table Calculations'],
      tags: ['Sales Analytics', 'Customer Segmentation', 'KPI Design', 'YoY Analysis'],
      heroImage: '/projects/sales-customer-1.png',
      metrics: [
        { label: 'Total Sales', value: '$733K', delta: '+20.4% vs PY', trend: 'up' },
        { label: 'Total Profit', value: '$93K', delta: '+12.5% vs PY', trend: 'up' },
        { label: 'Customers', value: '693', delta: '+8.6% vs PY', trend: 'up' },
        { label: 'Orders', value: '1,687', delta: '+28.3% vs PY', trend: 'up' },
      ],
      links: {
        tableau: 'https://public.tableau.com/app/profile/temilade.somade/vizzes',
      },
      caseStudy: {
        problem: [
          'Sales data was spread across subcategories with no unified profitability and volume view.',
          'Leadership relied on manual reporting and lacked instant visibility into category-level performance.',
        ],
        approach: [
          'Designed connected Sales and Customer views with synchronized KPI panels and trend sparklines.',
          'Built interactive filters for year, category, and region for fast drill-down without dashboard switching.',
          'Added visual encoding for above/below-average performance to reduce interpretation time.',
        ],
        insights: [
          'Phones and Chairs drove top sales while Tables operated at a loss.',
          'Top 10 customers represented a disproportionate share of total profitability.',
          'Most customers (400 out of 693) placed only 1-2 orders, signaling retention opportunities.',
        ],
        impact: [
          'Replaced manual weekly Excel reporting and saved an estimated 4-6 hours per week.',
          'Enabled real-time category and customer strategy decisions with a single source of truth.',
        ],
      },
    },
    {
      slug: 'hr-analytics-dashboard',
      projectType: 'tableau',
      title: 'Human Resources Analytics Dashboard',
      summary:
        'Delivered an executive-grade Tableau HR analytics suite for attrition, compensation equity, demographics, and employee-level drill-down.',
      role: 'Data Analyst & BI Specialist',
      period: '2023 - 2024',
      tools: ['Tableau Desktop', 'LOD Expressions', 'Parameter Controls', 'Dashboard Actions'],
      tags: ['HR Analytics', 'Workforce Intelligence', 'Compensation Analysis'],
      heroImage: '/projects/hr-dashboard-1.png',
      metrics: [
        { label: 'Active Employees', value: '7,984', delta: 'Current workforce', trend: 'flat' },
        { label: 'Total Hired', value: '8,950', delta: 'All-time hires', trend: 'up' },
        { label: 'Total Terminated', value: '966', delta: 'Tracked attrition', trend: 'down' },
        { label: 'Departments', value: '7', delta: 'Cross-functional coverage', trend: 'up' },
      ],
      links: {
        tableau: 'https://public.tableau.com/app/profile/temilade.somade/vizzes',
      },
      caseStudy: {
        problem: [
          'HR leaders lacked one integrated environment for attrition, equity, and workforce composition analysis.',
          'Quarterly workforce reporting depended on manual consolidation across multiple spreadsheets.',
        ],
        approach: [
          'Built an overview page for workforce KPIs, departmental hires/terminations, and geo distribution.',
          'Designed demographic and income analysis modules to support pay-equity and talent-performance review.',
          'Added a detailed employee-level filterable view for self-service managerial investigations.',
        ],
        insights: [
          'Operations had the largest workforce (2,429) and highest termination count (289).',
          'PhD holders averaged higher income levels, with strong clustering in top performance bands.',
          'Tenure distribution showed healthy balance between long-tenured employees and recent hires.',
        ],
        impact: [
          'Enabled compensation equity and attrition analysis in a single dashboard environment.',
          'Reduced ad-hoc HR data request overhead through employee-level self-service access.',
        ],
      },
    },
  ],
}

