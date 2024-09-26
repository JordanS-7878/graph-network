
# Graph Network Visualization

This is a simple web application built using React.js and D3.js that visualizes a graph network of nodes and edges. Users can dynamically add and remove nodes and edges by interacting with the buttons provided on the interface.

## Features

- **Add Nodes**: Allows users to add a new node. 
- **Add Edges**: Allows users to add an edge between two nodes.
- **Remove Nodes and Edges**: Allows users to remove a node or an edge.
- **Interactive Dragging**: Drag nodes around the canvas to rearrange the graph.
- **Zooming**: Zoom in and out of the graph for a better view.

## Technologies Used

- **React.js**: For building the user interface and managing the state of nodes and edges.
- **D3.js**: For rendering the SVG-based graph network and handling the visualization of nodes and edges.
- **HTML5/SVG**: Used for rendering the graph and user interface.

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (for managing dependencies)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/graph-network.git
   ```

2. Navigate to the project directory:

   ```bash
   cd graph-network
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the application in development mode, run the following command:

```bash
npm start
```

This will open the application in your default web browser at `http://localhost:3000/`.

## Design Choices

- **React State Management**: React's `useState` hook is used to manage the state of nodes and edges.
- **D3.js**: D3 is used to manipulate SVG elements directly, allowing for easy rendering and updating of nodes (circles) and edges (lines).
- **SVG**: The graph network is rendered using Scalable Vector Graphics (SVG), making it scalable and flexible for different screen sizes.

## Usage

- **Add Node Button**: Adds a new node to the right of the last node.
- **Add Edge Button**: Connects consecutive nodes with an edge if they are not already connected.
- **Remove Node Button**: Removes the last node and any edges connected to it.
- **Remove Edge Button**: Removes the last edge that was added.
- **Graph Dragging**: Drag nodes or edges around the graph to reposition them.
- **Graph Zooming**: Zoom in and out of the graph.