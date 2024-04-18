# Dromos

## Purpose

Dromos is designed to enhance user engagement and collaboration within a specific interest community through dynamic interactive node graphs which users can create, edit, maintain. This platform targets both public and private sector researchers, scientists and stakeholders, offering tools that not only facilitate comprehensive visualization of causal pathways, but also encourage collaboration and knowledge sharing.

This Readme explicates the following with the regard to the Dromos front-end. For back-end related topics, such as back-end technologies and database structure, see [Dromos-be](https://github.com/laskinner/dromos-be).

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
  - [Existing Features](#existing-features)
  - [Planned Features](#planned-features)
- [Components](#components)
- [Testing](#testing)
  - [Validator Testing](#validator-testing)
- [Known Bugs](#known-bugs)
- [Deployment](#deployment)
- [Credits](#credits)
- [Media](#media)

## Technologies Used

The technology stack and design choices for Dromos were purposefully selected with a clear focus on its future public use and the necessity for continuous evolution. The adoption of TypeScript over JavaScript, ShadCN/UI instead of Bootstrap, and TailwindCSS rather than traditional vanilla CSS, were all strategic decisions made to ensure the platform’s suitability for external parties. These choices are essential for maintaining the integrity and extensibility of Dromos as it transitions from initial development and portfolio project into a public-facing offering. The technologies chosen are not only robust and scalable but also support the objective of ongoing iteration and refinement, which is crucial considering that Dromos is intended to be enhanced and expanded by different developers over time.

### [React](https://reactjs.org/)
Used for building user interfaces with components, allowing for efficient and flexible UI development.

### [TypeScript](https://www.typescriptlang.org/)
Used for enhancing JavaScript code with static type definitions, TypeScript offers improved maintainability, understandability, and robustness of the codebase. By introducing static typing, it helps catch errors early in the development process and provides a more scalable foundation for large projects.

### [TailwindCSS](https://tailwindcss.com/)
Used for creating custom designs quickly with a utility-first CSS framework, enabling rapid styling directly in markup.

### [ShadCN/UI](https://github.com/shadcn/ui)
Used for creating modern and interactive user interfaces with a set of high-quality, customizable React components.

### [Lucide-React](https://github.com/lucide-icons/lucide)
Used for integrating scalable vector icons as React components, enhancing UI designs with easily customizable icons.

### [Fontawesome](https://fontawesome.com/)
Used for incorporating a wide array of icons into web and mobile interfaces, customizable via CSS for various design needs.

### [Zod](https://github.com/colinhacks/zod)
Used for schema declaration and validation, ensuring data integrity with type-safe input validation in JavaScript and TypeScript applications.

### [Zustand](https://github.com/pmndrs/zustand)
Used for managing state in React applications, providing a simple and minimalistic approach to global state management outside of the React render cycle.

### [SigmaJS](http://sigmajs.org/)
Used for drawing and managing large network graphs efficiently, enabling interactive visualizations directly within web applications.

### [pnpm](https://pnpm.io/)
Used for efficient and fast package management, pnpm offers a unique node_modules structure that saves disk space and reduces installation time by avoiding redundancy.

### [vite](https://vitejs.dev/)
Used for front-end tooling, Vite provides a fast development environment by leveraging modern web technologies. It offers hot module replacement and optimized build times, significantly improving the developer experience.


## Features

### Existing Features

- **Interactive Graph**: Utilizes SigmaJS to render interactive node graphs, enhancing user understanding of complex data structures.
- **User Authentication**: Secure login and registration system to manage user access and personalize user experiences.
- **Dynamic Graph Rendering**: Harnesses the power of SigmaJS and Django back-end to provide infrastructure to implement dynamic node coloring, sizing, and labeling.
- **Customizable User Profiles**: Users can customize their profiles, allowing them to add personal touches and relevant information.
- **Responsive Design**: Built with TailwindCSS for a seamless experience across all devices.
- **CRUD User Accounts**: Complete Create, Read, Update, and Delete (CRUD) capabilities for user accounts.
- **Feed of Graphs with Recent Activity**: Displays a live feed of graphs showing recent updates and interactions.
- **View Graphs**: Allows users to view details and statistics of graphs within the platform.
- **CRUD Graphs**: Users can create, read, update, and delete graphs.
- **CRUD Nodes**: Full CRUD functionality for managing nodes within the graphs.
- **CRUD Comments**: Users can comment on graphs and nodes, with full CRUD capabilities on these comments.
- **Ability to View a Node in Quick View Using a Drawer**: Quick access to view node details in a sliding drawer without leaving the current page.
- **Ability to View a Node in Full View with Comments**: Detailed view of a node including associated comments, enhancing user interaction and discussion.

### Planned Features

- **Ability to Open a Dropdown and Select Graph Layouts**: Users can choose from various graph layouts, including directed acyclic graphs using the Dagre algorithm.
- **Dynamic Coloring of Node Cycles**: Automatically highlights nodes that cycle back to parent nodes, aiding users in identifying and resolving feedback loops.
- **Ability to Fork Graphs**: Similar to GitHub, allows users to fork graphs for personal modifications or experimentation.
- **Sandbox Mode**: Enables users to experiment with graphs in a safe environment without altering the main graph data.
- **Advanced Analytics**: Including centrality analysis, D-separation, and other complex data analysis techniques.
- **Levels of Evidence for Nodes**: Allows users to assign and display levels of evidence or certainty to nodes within graphs.
- **Ability to Throttle Data Up and Down**: Users can simulate changes in node input data to see how these alterations propagate through the network.
- **Governance Model for Canonical Graphs**: Establishes a framework for managing and approving changes to canonical graphs.
- **Billing**: Implements a billing system for users, particularly useful for service monetization and managing premium features.
- **Mobile App**: Extend functionality with a native mobile application.

## Components
### React Components
| Component Name    | Description                                         |
|-------------------|-----------------------------------------------------|
| CauseSelector.tsx | Manages the selection of causes in a graph.         |
| CommentForm.tsx   | Handles the creation of new comments.               |
| CommentList.tsx   | Displays a list of comments.                        |
| CreateAccount.tsx | Form component for user account creation.           |
| CreateGraph.tsx   | Interface for creating new graphs.                  |
| CreateNode.tsx    | Provides a form to add new nodes to a graph.        |
| EditAccount.tsx   | Form component for editing user account details.    |
| GraphRenderer.tsx | Renders interactive graphs using SigmaJS.           |
| GraphSelector.tsx | Allows users to select different graphs to view.    |
| GraphView.tsx     | Main component for displaying a graph and its details. |
| Home.tsx          | Serves as the landing page of the application.      |
| LogIn.tsx         | Component for user login.                           |
| Navbar.tsx        | Navigation bar for the application.                 |
| NodeFullView.tsx  | Provides a detailed view of a node, including comments. |
| NodeQuickView.tsx | Offers a quick overview of a node's basic information in a drawer. |

### UI Components
| Component Name | Description                                           |
|----------------|-------------------------------------------------------|
| button.tsx     | A reusable button component for user interactions.    |
| card.tsx       | Displays content in a structured card format.         |
| command.tsx    | Invokes commands within interfaces.                   |
| dialog.tsx     | Provides modal dialogues for user confirmations or inputs. |
| drawer.tsx     | A sliding panel used for displaying additional information without leaving the current context. |
| form.tsx       | Generic form component for handling user inputs.      |
| input.tsx      | Input field for form data entry.                      |
| label.tsx      | Text label for UI elements, particularly form inputs. |
| popover.tsx    | Small overlay that opens on demand to show more content. |
| scroll-area.tsx| Custom scrollable area for wrapping content.          |
| select.tsx     | Dropdown selection component.                         |
| sheet.tsx      | Container that groups related content and actions.    |
| switch.tsx     | Toggle switch for enabling or disabling a setting.    |
| tabs.tsx       | Component for tabbed interfaces, allowing content organization. |
| textarea.tsx   | Text input field for multiline text.                  |
| toast.tsx      | Brief messages about app processes.                   |
| toaster.tsx    | Manages the display of toast notifications.           |
| tooltip.tsx    | Small informative message that appears when hovering over an element. |
| use-toast.tsx  | Hook for triggering toast notifications.              |

## Testing

### CRUD User Accounts
| Test Case       | Acceptance Criteria                                     | Result  |
|-----------------|---------------------------------------------------------|---------|
| Create Account  | Given the registration page, when a user submits valid registration details, then the system creates a new user account. | Passed  |
| Read Account    | Given a logged-in user, when they navigate to their profile page, then they see their account details. | Passed  |
| Update Account  | Given a logged-in user on their profile page, when they update their information and submit, then the system updates their account details. | Passed  |
| Delete Account  | Given a logged-in user on their profile page, when they choose to delete their account and confirm the action, then the system deletes their account. | Passed  |

### CRUD Graphs
| Test Case       | Acceptance Criteria                                     | Result  |
|-----------------|---------------------------------------------------------|---------|
| Create Graph    | Given a user on the graph creation page, when they input graph details and submit, then the system creates a new graph. | Passed  |
| Read Graph      | Given a user on the platform, when they select a graph, then they are able to view its details. | Passed  |
| Update Graph    | Given a user viewing a graph they own, when they update details and submit, then the system updates the graph's details. | Failed. User ID not being returned in graph view component, and therefore rendering the edit button does not function.  |
| Delete Graph    | Given a user viewing a graph they own, when they decide to delete the graph and confirm the action, then the system removes the graph. | Failed. See above problem with Update Graph.  |

### CRUD Nodes
| Test Case       | Acceptance Criteria                                     | Result  |
|-----------------|---------------------------------------------------------|---------|
| Create Node     | Given a user editing a graph, when they add a new node and specify its details, then the system adds the node to the graph. | Passed  |
| Read Node       | Given a user viewing a graph, when they select a node, then they see the node's details. | Passed  |
| Update Node     | Given a user viewing a node they own, when they update the node's details and submit, then the system updates the node within the graph. | Failed. Not yet implemented.  |
| Delete Node     | Given a user viewing a node they own, when they delete the node and confirm, then the system removes the node from the graph. | Failed. Not yet implemented.  |

### CRUD Comments
| Test Case        | Acceptance Criteria                                      | Result  |
|------------------|----------------------------------------------------------|---------|
| Create Comment   | Given a user viewing a graph or node, when they submit a comment, then the system adds the comment to the item. | Passed  |
| Read Comment     | Given a user on a graph or node page, when they view comments, then they see all posted comments. | Passed  |
| Update Comment   | Given a user viewing their comment, when they edit and submit the updated comment, then the system updates the comment on the graph or node. | Failed. Not yet implemented.  |
| Delete Comment   | Given a user viewing their comment, when they delete it and confirm, then the system removes their comment from the graph or node. | Failed. Not yet implemented.  |

### Permissions
| Test Case                                       | Acceptance Criteria                                                  | Result  |
|-------------------------------------------------|----------------------------------------------------------------------|---------|
| Non-Logged In Read                              | Given a non-logged-in user, when they navigate the platform, then they can only read available public graphs, nodes, and comments. | Passed  |
| Logged-In Create/Edit Graph                       | Given a logged-in user, when they create or edit content, then they can only modify content they have created. | Failed. While user is being returned to front-end, edit button is not being rendered in graph view.  |
| Logged-In Delete Own                            | Given a logged-in user viewing their own content, when they decide to delete it and confirm, then the system removes their content. | Failed, see above problem with edit.  |

### Validator Testing

**Note: Due to  errors and attempts at critical bug fixing until project submission, code has not yet been passed through a validator**

- **HTML**: Passed W3C validation without errors.
- **CSS**: No errors on Jigsaw validator.

### Known Bugs

- Editing and deleting graphs, nodes, and comments is not functioning due to conditional rendering not having the reuquired data to render the functionality.

## Deployment

Deployed on Heroku:

Automated deployment on Heroku is set up. To deploy, simply merge to main.

If errors arise, logs can be found in Heroku instances:

Front-end: dromos
Back-end: dromos-backend

## UX

### Nodes on design
In general, the choice keep Dromos simple is that it is a SaaS app for business purposes, and in a highly technical space. Therefore, bright colors, unneeded imagery and any otherwise distracted media and colors were not used. As well, the choice to maintain a highly minimal design was done purposefully to maintain flexibility, as there will be changes in the future.

### Graph View
This was the original Balsamiq for the Graph View. One can see the difference between the mock-up and final implementation, as it became apparent that a dropdown would rather than scrollable cards would free up space for other needed functionality, such as the selected graph card and create node button.
![image](https://github.com/laskinner/dromos/assets/1858258/cbee916a-d4a8-4ad5-bf32-b5d8e5c0f7fc)

### Navbar
Here, the actual implementation closely resembled the mock-ups of the Navbar:
![image](https://github.com/laskinner/dromos/assets/1858258/4ea02540-39cf-4a28-8e89-908e486eefc6)

### Needed improments

Some improvements would be required, including:
- Node Quick drawer, which appears upon clicking a node
- Comment formatting and node full view

Additional improments would include:
- Additionaly rendering algorithms for graph
- Arrows on graph rendering to show directionality

## Credits

### Content

- All content used in project is original.

### Media

- Icons from Fontawesome and Lucide.
- Logo generated using [logo.com](www.logo.com)
- Blood Pressure picture: Image by <a href="https://pixabay.com/users/mohamed_hassan-5229782/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7210325">Mohamed Hassan</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7210325">Pixabay</a>
