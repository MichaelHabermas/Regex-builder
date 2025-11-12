# Product Requirements Document (PRD) for Regex Builder

## 1. Overview
- **Product Name**: Regex Builder
- **Description**: Web tool for generating, testing, and debugging regex patterns with visual feedback.
- **Target Users**: Developers, engineers, testers, analysts handling text validation, extraction, cleaning.
- **Goals**: Simplify regex creation, provide instant testing, reduce syntax errors and debugging time.

## 2. User Personas and Stories
1. **Sarah Patel – Frontend Developer (PixelForge Studios)**  
   Use Case: Input validation for emails, phones, forms.  
   Pain Point: Hard to remember syntax; needs visual feedback.

2. **James O’Connor – Data Engineer (CloudStream Analytics)**  
   Use Case: Extract fields from CSV/JSON logs, clean data for pipelines.  
   Pain Point: Efficient regex for large-scale extraction; quick validation.

3. **Maria González – QA Automation Tester (TestLabs Ltd)**  
   Use Case: Assertions in browser/API tests (Playwright, Postman).  
   Pain Point: Fast testing/tweaking before script integration.

4. **Alex Kim – Security Analyst (Sentinel Cybersecurity)**  
   Use Case: Detect logs, IPs, phishing URLs.  
   Pain Point: Complex patterns for detection; readability, false positives.

5. **Priya Shah – Data Scientist (InsightIQ)**  
   Use Case: Clean text data from scraping/NLP.  
   Pain Point: Time-consuming Python debugging.

## 3. Key Features
- Regex pattern builder with visual editor.
- Real-time testing on sample text input.
- Syntax highlighting and error feedback.
- Pattern library for common use cases (e.g., email, phone).
- Export regex to code snippets (JS, Python).
- Dark/light mode support.

## 4. Technical Stack
- Framework: Vite + React + TypeScript.
- UI Components: Shadcn.
- Styling: Tailwind CSS 4.
- Installation Refs:  
  - Shadcn: https://ui.shadcn.com/docs/installation/vite  
  - Tailwind: https://tailwindcss.com/docs/installation/using-vite

## 5. Scope and Assumptions
- MVP: Core builder, tester, export.
- Out of Scope: Advanced AI suggestions, multiplayer collab.
- Assumptions: Browser-based; no backend initially.

## 6. Success Metrics
- User satisfaction: Reduced time to create valid regex.
- Adoption: Feedback from target personas.
