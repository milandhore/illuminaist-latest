export const ebooks = [
  {
    id: 1,
    slug: "rag-engineering-guide",
    title: "The RAG Engineering Handbook",
    subtitle: "From Prototype to Production (2026 Edition)",
    description: "A comprehensive 120-page playbook covering advanced chunking strategies, multi-vector retrieval, embedding fine-tuning, cross-encoder re-ranking, and production deployment patterns for enterprise RAG.",
    topics: [
      "Chunking Strategies",
      "Vector Databases",
      "Embedding Models",
      "Cross-Encoders",
      "RAGAS Evaluation",
      "Production Architecture"
    ],
    pages: 120,
    downloadUrl: "/ebooks/rag-engineering-guide.pdf",
    coverGradient: "from-cyan-900 via-cyan-700 to-slate-900",
    accentColor: "#00F0FF",
    icon: "🔍"
  },
  {
    id: 2,
    slug: "mlops-llm-guide",
    title: "MLOps for Large Language Models",
    subtitle: "Kubernetes, Monitoring & Cost Control",
    description: "A practical 96-page guide for ML and platform engineers deploying LLMs at scale — covering vLLM serving, GPU cluster scheduling, Prometheus/Grafana observability, and enterprise FinOps strategies.",
    topics: [
      "vLLM & TGI Setup",
      "Kubernetes + KEDA",
      "GPU Scheduling",
      "Observability",
      "Cost Optimisation",
      "CI/CD for Models"
    ],
    pages: 96,
    downloadUrl: "/ebooks/mlops-llm-guide.pdf",
    coverGradient: "from-amber-900 via-amber-700 to-slate-900",
    accentColor: "#FFB800",
    icon: "⚙️"
  }
];
