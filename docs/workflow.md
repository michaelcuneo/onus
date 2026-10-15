# ONUS RFI — Product & Workflow Working Document

**Status:** Working draft for Scott and the development team  
**Last reviewed:** 15 October 2026  
**Purpose:** Describe **what ONUS should do from a user's point of view**. Please edit this document freely; it is a discussion and requirements document, **not** a claim that these workflows have been built.

> **Scott: please add, remove or rewrite anything here.** Real construction examples are especially useful. Write in plain English; no technical knowledge is required. Anything labelled **To decide** is deliberately open for discussion.

## How to edit this document

1. Open this file on GitHub and click the **pencil / Edit this file** control (you will need repository write access).
2. Change the text, fill in the **To decide** sections, or add a new workflow using the template at the bottom.
3. Use **Preview** to see the formatted result.
4. Choose **Propose changes** / **Commit changes**; preferably make a new branch and pull request so we can review differences before merging. GitHub may offer slightly different controls depending on permissions.
5. If you are unsure how to describe a process, just write what happens on site, who is involved and what needs to happen next.

Please do not include actual customer credentials, sensitive personal information, confidential project documents or commercial secrets in this **public** repository. Use fictional examples here.

## 1. The idea, in everyday language

ONUS provides one place for a project manager to see **what is outstanding, who is responsible, what evidence exists, and what action is needed**. The information may come from ONUS itself or from programs that the company already uses.

ONUS should avoid making someone enter the same information twice. It should watch for important changes from connected systems, determine what those changes mean for the project, show the latest verified position and support sensible reminders or escalations.

It is not necessarily the system in which every drawing, document, email or task was originally created. We need to decide which connected program is the authority for each kind of information.

## 2. Who uses ONUS?

| Person / role | What they need | To decide |
| --- | --- | --- |
| Project manager | Overview of outstanding items, ownership, blockers, deadlines and history | Which actions should they be able to approve or trigger? |
| Contracts administrator | Correspondence, RFIs, notices, supporting evidence and exports | Which records and reports are essential? |
| Contractor / subcontractor | Understand and respond to assigned items | Direct access to ONUS, or updates from existing software? |
| Architect / consultant | Receive questions, provide responses and sign off decisions | Which connected tools are already used? |
| Client / superintendent | Review relevant matters and supporting evidence | What should they see and what must remain hidden? |
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

## 9. What the project manager sees

A possible home dashboard might have:

- **Needs attention:** Unanswered RFIs, unsigned documents, unapproved items, undelivered notices and stalled work.
- **Responsible person:** Who owns the next required action, and whether the assignment is verified.
- **Deadline and age:** Due date, elapsed time, and whether the agreed response time has been exceeded.
- **Dependencies:** Why work is blocked and which condition would unblock it.
- **Evidence and source:** Where the information came from and when ONUS last verified it.
- **Changes since last visit:** Newly answered RFIs, completed signatures, failed integrations and reopened actions.
- **Suggested next actions:** Draft a reminder, request a refreshed status, contact a responsible person, or review a disputed item.

Suggestions should never silently become authoritative records. Project managers must be able to inspect the source and correct inaccurate links or conclusions.

**Scott — what are the five things a project manager should see first?**

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

Please add exact vendor/product names and a real-world example. **No integration below is confirmed as built.**

| System / product | What it stores or does | Data ONUS needs to read | Actions ONUS should be able to perform | Priority |
| --- | --- | --- | --- | --- |
| PCX — **exact product name to confirm** | To confirm | To confirm | To confirm | To confirm |
| Second construction application — name needed | To confirm | To confirm | To confirm | To confirm |
| Document signing application — name needed | Signatures and completion | Status, signatories, dates, evidence | Perhaps initiate / remind | To confirm |
| Email system — name needed | Correspondence | Send/delivery/bounce, replies if supported | Perhaps draft/send | To confirm |
| Scheduling / programme application — name needed | Tasks, programme dates, dependencies | Status and dependencies | Perhaps update status | To confirm |

## 15. What we still need to agree

- [ ] Which **three real integrations** must work first?
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
| | | | |

For technical implementation details, see [architecture.md](architecture.md). This document is deliberately about **business behaviour and user expectations**.
