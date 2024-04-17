# Dromos

## Overview

Dromos is designed to enhance user engagement and collaboration within a specific interest community through dynamic interactive node graphs which users can create, edit, maintain. This platform targets both public and private sector researchers, scientists and stakeholders, offering tools that not only facilitate comprehensive visualization of causal pathways, but also encourage collaboration and knowledge sharing.

This Readme explicates the following with the regard to the Dromos front-end. For back-end related topics, such as back-end technologies and database structure, see [Dromos-be](https://github.com/laskinner/dromos-be).

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
  - [Existing Features](#existing-features)
  - [Planned Features](#planned-features)
- [Testing](#testing)
  - [Validator Testing](#validator-testing)
- [Known Bugs](#known-bugs)
- [Deployment](#deployment)
- [Credits](#credits)
- [Media](#media)

## Technologies Used

### [React](https://reactjs.org/)
Used for building user interfaces with components, allowing for efficient and flexible UI development.

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
| Update Graph    | Given a user viewing a graph they own, when they update details and submit, then the system updates the graph's details. | Passed  |
| Delete Graph    | Given a user viewing a graph they own, when they decide to delete the graph and confirm the action, then the system removes the graph. | Passed  |

### CRUD Nodes
| Test Case       | Acceptance Criteria                                     | Result  |
|-----------------|---------------------------------------------------------|---------|
| Create Node     | Given a user editing a graph, when they add a new node and specify its details, then the system adds the node to the graph. | Passed  |
| Read Node       | Given a user viewing a graph, when they select a node, then they see the node's details. | Passed  |
| Update Node     | Given a user viewing a node they own, when they update the node's details and submit, then the system updates the node within the graph. | Passed  |
| Delete Node     | Given a user viewing a node they own, when they delete the node and confirm, then the system removes the node from the graph. | Passed  |

### CRUD Comments
| Test Case        | Acceptance Criteria                                      | Result  |
|------------------|----------------------------------------------------------|---------|
| Create Comment   | Given a user viewing a graph or node, when they submit a comment, then the system adds the comment to the item. | Passed  |
| Read Comment     | Given a user on a graph or node page, when they view comments, then they see all posted comments. | Passed  |
| Update Comment   | Given a user viewing their comment, when they edit and submit the updated comment, then the system updates the comment on the graph or node. | Passed  |
| Delete Comment   | Given a user viewing their comment, when they delete it and confirm, then the system removes their comment from the graph or node. | Passed  |

### Permissions
| Test Case                                       | Acceptance Criteria                                                  | Result  |
|-------------------------------------------------|----------------------------------------------------------------------|---------|
| Non-Logged In Read                              | Given a non-logged-in user, when they navigate the platform, then they can only read available public graphs, nodes, and comments. | Passed  |
| Logged-In Create/Edit Own                       | Given a logged-in user, when they create or edit content, then they can only modify content they have created. | Passed  |
| Logged-In Delete Own                            | Given a logged-in user viewing their own content, when they decide to delete it and confirm, then the system removes their content. | Passed  |

### Validator Testing

- **HTML**: Passed W3C validation without errors.
- **CSS**: No errors on Jigsaw validator.

### Known Bugs

## Deployment

Deployed on Heroku:

1. Set up the Heroku project.
2. Linked to GitHub repository for continuous deployment.
3. Configured environment variables in Heroku settings.

## UX

## Credits

### Content

- All content used in project is original.

### Media

- Icons from Fontawesome and Lucide.
- Logo generated using [logo.com](www.logo.com)
