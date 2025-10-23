# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - main [ref=e4]:
    - generic [ref=e5]:
      - heading "Export Reports" [level=1] [ref=e6]
      - generic [ref=e7]:
        - heading "CSV Export" [level=2] [ref=e9]
        - generic [ref=e11]:
          - generic [ref=e13]:
            - generic [ref=e14]: Start Date
            - textbox "Start Date Start Date" [ref=e16]: 2024-01-01
          - generic [ref=e18]:
            - generic [ref=e19]: End Date
            - textbox "End Date End Date" [ref=e21]: 2024-12-31
          - button "Export CSV" [ref=e22] [cursor=pointer]
  - alert [ref=e23]
```