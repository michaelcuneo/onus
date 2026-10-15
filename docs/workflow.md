# ONUS — Product Direction & Workflow Working Document

**Status:** Working draft for Scott and the development team  
**Last reviewed:** 15 October 2026  
**Purpose:** Document Scott's product direction and the business workflows ONUS should deliver for property developers and client-side project managers. Please edit this document freely; it is a discussion and requirements document, **not** a claim that these workflows have been built.

> **Scott: please add, remove or rewrite anything here.** Real construction examples are especially useful. Write in plain English; no technical knowledge is required. Anything labelled **To decide** is deliberately open for discussion.

## How to edit this document

1. Open this file on GitHub and click the **pencil / Edit this file** control (you will need repository write access).
2. Change the text, fill in the **To decide** sections, or add a new workflow using the template at the bottom.
3. Use **Preview** to see the formatted result.
4. Choose **Propose changes** / **Commit changes**; preferably make a new branch and pull request so we can review differences before merging. GitHub may offer slightly different controls depending on permissions.
5. If you are unsure how to describe a process, just write what happens on site, who is involved and what needs to happen next.

Please do not include actual customer credentials, sensitive personal information, confidential project documents or commercial secrets in this **public** repository. Use fictional examples here.

## 1. Product direction & scope — Scott's authored vision

### 1.1 Product vision

ONUS is a **construction workflow and productivity platform designed specifically for property developers and client-side project managers**.

Development and client-side project teams sit at the centre of complex projects, coordinating architects, engineers, consultants, builders, authorities and other stakeholders. Each party may use different software, communication channels, document systems and internal processes.

The result is fragmented information, duplicated administration, constant follow-ups and project managers spending too much time coordinating work rather than managing project outcomes.

ONUS connects the systems, people and workflows involved in delivering a construction project, **preparing the next actions and reducing the administrative burden on the project manager**.

It is not intended to replace established construction software with another project management suite. Instead, it works across the platforms already used by the project team, connecting information and coordinating activity between them.

### 1.2 Connect the software developers and client-side PMs already use

ONUS should work across the broader construction technology ecosystem, including:

| Area | Example products and information sources |
| --- | --- |
| Construction and project management | Procore, Autodesk Construction Cloud, Aconex |
| Task and workflow management | Monday.com, Smartsheet, Asana and similar systems |
| Communication | Microsoft Teams, Outlook, Gmail, Slack |
| Documents and information | SharePoint, OneDrive, Google Drive, Excel, PDF records |
| Construction programmes | Microsoft Project, Primavera P6 and programme information in other supported systems |
| Design and technical coordination | Revit, Bluebeam, drawing registers, technical submissions |
| Commercial and project controls | Cost plans, variations, procurement, approvals and reporting systems |

These are examples of the **intended integration ecosystem**, not a claim that every integration is currently available.

Developers and client-side PMs should not have to change the way every consultant or contractor works just to achieve better coordination. ONUS should connect relevant information across these systems, maintain relationships between records and help move work forward without requiring the PM to manually reconcile everything.

### 1.3 The daily WIP — the PM's control centre

The central experience should be a **daily work-in-progress (WIP) review prepared by ONUS**.

Instead of individually opening Procore, Monday.com, Teams, Outlook, document registers and construction programmes to discover what's changed, the PM gets a consolidated, ready-to-review view of what needs attention.

The WIP should contain five categories:

| WIP category | What it should surface |
| --- | --- |
| **Actions ready for approval** | Draft emails and follow-ups; requests for information/approvals; proposed task/register updates; actions arising from meetings, correspondence and document revisions |
| **Outstanding work and blockers** | Overdue RFIs, submittals, consultant responses, missing approvals, unresolved decisions, deliverables and dependencies preventing other work |
| **Programme and delivery risks** | Milestones and deadlines; outstanding decisions connected to programme activities; potential delays needing investigation; procurement, construction and handover dependencies |
| **Escalations needing PM judgement** | Conflicts between systems, repeated non-responses, potential scope/cost/programme implications, developer decisions and formal instructions |
| **Completed actions and changes** | Responses received, approved actions executed, updated registers and remaining follow-up items |

Where available, each WIP item should display **context, source, responsible person, due date, confidence or verification status, and proposed next step**.

The PM should be able to **approve, reject, amend or escalate** proposed actions. ONUS then carries out approved tasks *where supported and permitted*, records their outcome and reports back on failures.

**Example daily WIP flow:**

1. Connected applications report changes and ONUS reconciles missing information as needed.
2. ONUS links records to projects, people and dependencies; it does not pretend uncertain matches are verified.
3. Project rules identify outstanding actions, blockers, milestones, conflicts and possible follow-ups.
4. ONUS prepares the daily WIP and proposed actions, prioritised for the client-side PM.
5. The PM reviews supporting evidence and approves, rejects, edits or escalates each proposal.
6. ONUS performs authorised actions through the relevant connected service, with safe retries and a tracked outcome.
7. Completed actions, unsuccessful attempts and newly discovered dependencies appear in the next WIP or live updates.

**To decide:** When should the WIP be produced (morning, on demand, both)? Should approvals be individual, bulk or grouped? Which sources have priority when information conflicts? Who can approve an external instruction?

### 1.4 Built around the client-side role

ONUS should reflect the responsibilities of **developers and client-side project managers**, not merely reproduce a head contractor's workflows.

Its coverage should encompass:

- Consultant deliverables and coordination.
- Design reviews, drawing revisions and approvals.
- RFIs and technical decisions.
- Programme milestones, dependencies and reporting.
- Procurement and long-lead items.
- Cost plans, variations and commercial approvals.
- Client decisions and stakeholder commitments.
- Meeting actions and consultant follow-ups.
- Construction progress, defects and handover.
- Accountability, reporting and supporting evidence.

The value is not simply knowing that an RFI is overdue. It is understanding **what the outstanding response relates to, who needs to act, what other work depends on it and what the PM should do next**.

Any programme or contractual impact must be presented according to available evidence. An overdue action alone does not establish an actual project delay or an entitlement to an extension of time.

### 1.5 The intended experience

ONUS should feel like a project coordinator working in the background across the software ecosystem.

It gathers relevant updates, connects the information, identifies what needs attention and prepares the next actions. The PM starts the day with a ready-to-review WIP rather than spending the morning assembling one manually.

> **ONUS connects the software. Coordinates the work. Prepares the decisions.**

The PM retains control over consequential actions, while routine administration and coordination are progressively reduced.

The ultimate objective is to give developers and client-side project managers greater oversight of their projects while spending less time chasing information and managing disconnected systems.

## 2. Who uses ONUS?

| Person / role | What they need | To decide |
| --- | --- | --- |
| **Developer / client-side project manager (primary user)** | Daily WIP, prepared decisions, project-wide oversight, programme and commercial risks, delegated follow-ups | Which proposed actions need PM approval, and which may run automatically? |
| Contracts administrator | Correspondence, RFIs, notices, supporting evidence and exports | Which records and reports are essential? |
| Contractor / subcontractor | Understand and respond to assigned items | Direct access to ONUS, or updates from existing software? |
| Architect / consultant | Receive questions, provide responses and sign off decisions | Which connected tools are already used? |
| Developer representative / client / superintendent | Review relevant decisions, instructions, scope, cost and programme matters | Which decisions require developer sign-off and what must remain confidential? |
| Organisation administrator | Add members, configure integrations and project permissions | Who can connect applications or grant access? |
| ONUS platform administrator | Support tenants and diagnose integration problems | What can support staff access, and with whose permission? |

**To decide — additional roles, responsibilities or permission boundaries:**

- [ ] 
- [ ] 

## 3. Starting a project

**Scenario:** A company begins managing a construction project with ONUS.

1. An authorised person creates an organisation/workspace or joins an existing one.
2. They create a project, define its details and invite the relevant participants.
3. They connect whichever external applications are needed, with the right permissions.
4. ONUS imports or links relevant existing records, such as RFIs, drawing registers, approvals and correspondence, where supported.
5. A project administrator checks that imported records map to the correct project and people.
6. The dashboard shows initial workload, missing information and outstanding actions.

**To decide:** Can a project be created from a connected application? Who approves the first import? What happens when an external record cannot be matched to the correct project?

## 4. Example workflow: Request for Information (RFI)

**Scenario:** A subcontractor needs clarification before proceeding with work.

1. The subcontractor raises an RFI in ONUS **or** in a connected construction system.
2. ONUS links the RFI to the correct project, originator, question, documents and source reference.
3. An authorised person assigns the responsible respondent and, where applicable, a response deadline.
4. The respondent receives the RFI through the agreed channel.
5. The response is submitted through ONUS or the external application.
6. ONUS records the response, when it was observed, its source and supporting documents.
7. The authorised person determines whether the response is sufficient, requires clarification or can close the item.
8. ONUS updates the dashboard and retains the history of assignments, changes and responses.

**Exceptions to consider:** RFI sent to the wrong person; reassignment; no response; partial answer; answer revised; competing answers from different systems; reopened RFI; missing attachment.

**To decide:** What statuses and contractual response time rules should apply? Who has authority to close an RFI? Is a response the same thing as a resolution?

## 5. Example workflow: Document needs signing

**Scenario:** A document must be signed before the next project activity can proceed.

1. ONUS identifies a document requiring signatures from an existing system or from a request created in ONUS.
2. The signing application remains the source of truth for who has signed and whether the signing process is complete.
3. ONUS displays outstanding signatories and the relevant deadline if the provider supplies that information.
4. A verified update arrives when someone signs.
5. ONUS distinguishes **one person has signed** from **every required signature is complete**.
6. Once completion is verified, ONUS checks whether the dependent task is ready to progress.
7. Any newly available action or remaining blocker appears on the project dashboard with a link to its evidence.

**Exceptions:** A signer declines, a document is voided or revised, an invitation expires, or the external provider cannot be reached.

**To decide:** Which document signing service is used? Can ONUS request signatures, or only read their status? Which roles can override or waive a requirement?

## 6. Example workflow: Email and correspondence

**Scenario:** A notice or request has been sent and someone needs to know whether it arrived.

1. An authorised user sends correspondence through ONUS or an integrated email system, where supported.
2. ONUS records the message identifier, sender, recipients and source.
3. If the provider reports message acceptance or transmission, ONUS shows **sent/accepted**, not **delivered**.
4. If a reliable delivery event becomes available, ONUS records **delivered**. Delivery does not prove someone read the message.
5. Bounces or failures are shown as requiring attention.
6. Reminders, replies and acknowledgements follow the relevant project rules and user permissions.

**Exceptions:** The sender uses an unrelated personal mailbox; a recipient is incorrect; an external provider cannot confirm delivery; multiple people are copied.

**To decide:** Which email platforms are essential? What constitutes a formal project notice? Does sending external correspondence always require confirmation by a person?

## 7. Example workflow: Project approvals and dependencies

**Scenario:** Work cannot proceed until several independent conditions have been met.

1. A project manager defines the required approvals or links them from another system.
2. Each condition has an owner, supporting evidence and a clearly defined completion rule.
3. ONUS displays what is complete and what remains outstanding.
4. When a trusted external update arrives, ONUS checks that condition.
5. ONUS evaluates **all** conditions: one completed approval does not automatically unblock the whole activity.
6. Once everything required is verified, the activity may be marked ready for the next authorised step.
7. If a dependency becomes invalid or is revised, ONUS highlights the new blocker and its history.

**To decide:** Should ONUS merely flag readiness, or be allowed to change task status in another system? Who can approve an exception?

## 8. How ONUS notices that something has happened

**Preferred behaviour:** When a connected application supports it, it sends ONUS a trusted event (often called a webhook), rather than ONUS repeatedly asking whether anything changed.

1. An event arrives from a connected system.
2. ONUS verifies it and identifies which organisation, project and item it belongs to.
3. ONUS records the received information and supporting source reference.
4. It checks whether this is a new change or a duplicate, and whether a newer event already supersedes it.
5. It updates relevant project status, runs the permitted workflow and informs the appropriate people.
6. If processing fails, ONUS records the problem, retries safely and alerts administrators when human action is required.

**Fallback:** Some systems do not support reliable events. ONUS may check these systems on an appropriate schedule and reconcile missed updates. A timer may also be used to remind someone when a real deadline arrives. This is different from running a constant cron job against every connected system.

**To decide:** How quickly must changes become visible? When is a delay of a few minutes acceptable?

## 9. The daily WIP and the project manager's control centre

**The daily WIP described in section 1.3 is the primary product experience**. A dashboard supports that review, rather than replacing it with a collection of generic status cards. It should also allow on-demand updates and historical review. Useful views include:

- **Needs attention:** Unanswered RFIs, unsigned documents, unapproved items, undelivered notices and stalled work.
- **Responsible person:** Who owns the next required action, and whether the assignment is verified.
- **Deadline and age:** Due date, elapsed time, and whether the agreed response time has been exceeded.
- **Dependencies:** Why work is blocked and which condition would unblock it.
- **Evidence and source:** Where the information came from and when ONUS last verified it.
- **Changes since last visit:** Newly answered RFIs, completed signatures, failed integrations and reopened actions.
- **Actions ready for approval:** Draft communications, register updates, reminders and follow-ups, with Approve / Reject / Amend / Escalate controls.
- **Programme and delivery risks:** Possible milestone, procurement, cost and handover impacts requiring investigation.
- **Escalations for developer/PM judgement:** Conflicting information, repeated non-responses and formal instructions.
- **Completed actions:** Whether approved cross-system tasks actually succeeded, failed or still need attention.
- **Suggested next actions:** Draft a reminder, request a refreshed status, contact a responsible person, or review a disputed item.

Suggestions should never silently become authoritative records. Project managers must be able to inspect the source and correct inaccurate links or conclusions.

**Scott — within the five WIP categories, what should the PM see first?**

1. 
2. 
3. 
4. 
5. 

## 10. Notifications and escalation

**Proposed workflow:**

1. A verified change or a scheduled deadline triggers a relevant project rule.
2. ONUS checks the person's role, whether a notice is justified, whether it has already been sent and which delivery channel is allowed.
3. ONUS creates a notification or a draft external message.
4. Any consequential outbound action follows the organisation's approval policy.
5. Delivery attempts, failures and acknowledgements are recorded separately.

**To decide:**

- How long should someone have to respond before reminders or escalation?
- Are reminder rules contractual, project-specific or organisation-wide?
- Which actions may be automatic, and which must be approved by a human?
- Who should receive escalating notices?
- Can users mute non-critical notifications without hiding contractual deadlines?

## 11. Intelligent assistant / MCP-assisted workflows

ONUS may provide an assistant that can ask connected tools for information and propose actions, for example:

> “What is holding up Project Riverside, who needs to act, and what evidence supports that?”

A good answer would list the specific blockers, their current verified status, responsible people and links back to the underlying source records. It might suggest a reminder, but an external message or material project update should follow the right permission and confirmation process.

**Important:** The assistant and its MCP tools are a convenient way to **look up information and request actions**. The normal ONUS application remains responsible for reliable event processing, rules, permissions, history and workflow execution. A chain of MCP calls is not itself proof that a document was signed or a task completed.

**To decide:** Which questions should the assistant answer on day one? Should it only recommend actions initially?

## 12. What happens when information is wrong or unavailable?

ONUS needs to behave predictably, including when external applications fail.

- **Duplicate update:** Do not create duplicate changes or notifications.
- **Late/out-of-order event:** Do not incorrectly roll back a newer confirmed state.
- **Disconnected application:** Show stale/unknown status, not an invented “complete”.
- **Conflicting records:** Flag them and link to each source; establish an authoritative source.
- **Wrong project match:** Allow an authorised person to correct the mapping with an audit record.
- **Failed action:** Show failure, retry where safe, and provide a support path.
- **No proof of a claim:** Clearly mark it unverified instead of treating it as fact.

## 13. Demonstration workflow

The public site should open a **proper full-screen ONUS demonstration**, not a small embedded mock-up. It should use the real interface and representative workflows with fake data:

- Multiple fictional projects, users and responsibilities.
- Open, answered, overdue and closed RFIs.
- Documents awaiting signatures, partially signed, completed or declined.
- Sample emails with accepted, delivered and failed statuses.
- Blocked activities that become ready when their dependencies are satisfied.
- A way to switch fictional role perspectives and reset the demonstration.

**Safety:** The demo must not send real emails, mutate customer systems, charge money or reveal other visitors' records. It can simulate external application events and intentionally show error cases.

**To decide:** Which three workflows should a prospective customer be able to complete in a five-minute demo?

1.
2.
3.

## 14. Systems we want ONUS to connect to

The target ecosystem is described in section 1.2. Scott and the team can use this working table to identify the **first actual integrations**, their business value, and which operations are safe to automate.

**Mentioning a product is not a claim of an existing integration.** Verify each vendor's real API, webhook availability, permissions and contractual restrictions before implementation.

| System / product | Example workflow / records | What ONUS reads | Proposed outbound action | Priority / owner |
| --- | --- | --- | --- | --- |
| Procore | RFIs, submittals, correspondence | To confirm | To confirm | To confirm |
| Autodesk Construction Cloud | Drawings, reviews, issues | To confirm | To confirm | To confirm |
| Aconex | Document and transmittal workflows | To confirm | To confirm | To confirm |
| Monday.com / Smartsheet / Asana | Tasks, follow-ups, approvals | To confirm | To confirm | To confirm |
| Microsoft Teams / Slack | Project decisions, meeting follow-ups | To confirm | Draft/post after approval? | To confirm |
| Outlook / Gmail | Emails, responses, notices | To confirm | Draft/send after approval? | To confirm |
| SharePoint / OneDrive / Google Drive | Documents, revisions, registers | To confirm | Update linked records? | To confirm |
| Microsoft Project / Primavera P6 | Milestones, planned dates, dependencies | To confirm | Update only with explicit authority? | To confirm |
| Revit / Bluebeam | Design reviews and technical submissions | To confirm | To confirm | To confirm |
| Commercial / cost control tools | Variations, cost plans, procurement | To confirm | To confirm | To confirm |
| PCX — exact vendor/product unconfirmed | To clarify with Scott | To confirm | To confirm | To confirm |

**To decide:** Which three integrations are indispensable for a useful **daily WIP**, not simply useful to have eventually? What credentials and sandbox accounts can we access?

## 15. What we still need to agree

- [ ] Which **three real integrations** must work first to produce a useful daily WIP?
- [ ] Define the daily WIP generation schedule, on-demand refresh, priority rules and review interface.
- [ ] Define PM approval / rejection / amendment / escalation rules, including approval of external messages and formal instructions.
- [ ] Define the cross-system action outcome states (proposed, awaiting approval, approved, executing, succeeded, failed, needs review).
- [ ] Decide how to correlate meeting actions, correspondence, drawing revisions, cost items and programme dependencies.
- [ ] Who creates projects, invites people and authorises external connections?
- [ ] What is the correct end-to-end RFI lifecycle, including clarification and closure?
- [ ] Which document/signature/approval states are meaningful on real sites?
- [ ] Which data may ONUS change in other systems, and who authorises those changes?
- [ ] What exactly counts as overdue, blocked, resolved or completed?
- [ ] Which notifications and escalation actions should be automatic?
- [ ] What evidence is needed for audit, disputes and any EOT-related reports?
- [ ] What should a prospective customer experience in the first five minutes of the demo?
- [ ] Which legal/commercial or confidentiality requirements should affect product behaviour?

## 16. Add another workflow here

Copy and complete this template whenever an important process is missing.

### Workflow: [Name]

**Who starts it:** [Role or external system]

**Why it happens:** [Business problem]

**Starting event:** [What actually happened?]

**Steps:**

1. [What happens first?]
2. [What happens next?]
3. [What does ONUS record or show?]
4. [Who makes the next decision?]

**What a successful result looks like:** [Outcome]

**What could go wrong:** [Exceptions]

**Which existing programs are involved:** [Names]

**Who has permission to act:** [Roles]

**What evidence is needed:** [Records or documents]

**Questions / decisions:** [Anything uncertain]

---

## Collaboration notes / decision log

Use this section for important agreed changes. Keep tentative ideas in the workflow sections until confirmed.

| Date | Decision or proposed change | Proposed by | Agreed? |
| --- | --- | --- | --- |
| 15 Oct 2026 | Integration-first, event-driven SaaS; MCP assists but does not replace reliable workflows | Project discussion | Working direction |
| 15 Oct 2026 | Separate editable workflow document, distinct from technical architecture | Project discussion | Yes |
| 15 Oct 2026 | Recenter product on **property developers and client-side PMs**, with the **daily WIP and approval queue** as the primary experience; expand targeted integrations beyond RFIs | Scott Gordon (product direction) | Author-proposed direction |
| | | | |

For technical implementation details, see [architecture.md](architecture.md). This document is deliberately about **business behaviour and user expectations**.
