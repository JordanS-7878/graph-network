import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const GraphNetwork = () => {
  // Initialize 3 nodes
  const [nodes, setNodes] = useState([
    // Declare the id for each node along with their x and y coordinates
    { id: 1, x: 50, y: 200 }, 
    { id: 2, x: 150, y: 200 }, 
    { id: 3, x: 250, y: 200 }  
  ]);

  const [edges, setEdges] = useState([
    { source: 1, target: 2 }, // Edge from node 1 to node 2
    { source: 2, target: 3 } // Edge from node 2 to node 3
  ]);

  // Reference the `svg` element that D3.js will manipulate
  const svgRef = useRef();

  // Implement `useRef` to access and manipulate DOM (Document Object Model) elements
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 });

  /* Responsive Screen */
  useEffect(() => {
    // This function triggers whenever the window is resized
    const handleResize = () => {
      // Retreive the parent element/container of `svgRef` which is `graph-network-container`
      const container = svgRef.current.parentElement;
      // Checks if `container` exists or else no further code will run
      if (container) {
        // Updates `dimensions` state with the width of the parent container and a fixed height of 400px
        setDimensions(
          // container: Refers to the parent element of the svg, which is the <div className="graph-network-container">
          // clientWidth: Gives the width of the container's visible content area, measured in pixels
          { width: container.clientWidth, height: 400 }
        );
      }
    };

    // Calls `handleResize` function immediately to set the initial dimensions when component mounts
    handleResize();

    // Add event listener to `window` object on the browser event called `resize` that triggers whenever the window is resized
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Selects the current SVG element being referenced using D3.js, to render the graph
    const svg = d3.select(svgRef.current);
    
    // Clears all the previous elements inside the SVG
    // Because new elements will be added without clearing old ones everytime `useEffect` runs 
    svg.selectAll('*').remove();

    // A <g> element is appended to the SVG
    // This group will contain all the graph elements (nodes, edges)
    // and will be the target for zoom and pan transformations
    const g = svg.append('g');

    // Set up zoom behavior for SVG
    svg.call(d3.zoom()
      .scaleExtent([0.5, 5]) // Set zoom limits (0.5x min zoom, 5x max zoom)
      .on('zoom', (event) => {
        // Appends the zoom transformation to the <g> element
        g.attr('transform', event.transform);
      })
    );

    // Create edges group
    const edgesGroup = g.append('g').attr('class', 'edges');
    const nodesGroup = g.append('g').attr('class', 'nodes');

    // Render edges
    edgesGroup.selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('x1', d => nodes.find(n => n.id === d.source).x)
      .attr('y1', d => nodes.find(n => n.id === d.source).y)
      .attr('x2', d => nodes.find(n => n.id === d.target).x)
      .attr('y2', d => nodes.find(n => n.id === d.target).y)
      .attr('stroke', '#aaaaaa')
      .attr('stroke-width', 6);

    // Render nodes
    const nodeElements = nodesGroup.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 30)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', '#007bff')
      .attr('stroke', '#0056b3')
      .attr('stroke-width', 2)
      .call(d3.drag() // Add drag functionality
        .on('start', dragStarted)
        .on('drag', dragged)
      );

    function dragStarted(event, d) {
      d3.select(this).raise(); // Raise the dragged element
    }

    function dragged(event, d) {
      d.x = event.x; // Update node x position
      d.y = event.y; // Update node y position
      d3.select(this) // Update the node's position
        .attr('cx', d.x)
        .attr('cy', d.y);
      edgesGroup.selectAll('line') // Update the edges
        .attr('x1', e => nodes.find(n => n.id === e.source).x)
        .attr('y1', e => nodes.find(n => n.id === e.source).y)
        .attr('x2', e => nodes.find(n => n.id === e.target).x)
        .attr('y2', e => nodes.find(n => n.id === e.target).y);
    }
  
  }, [nodes, edges]);

  const addNode = () => {
    if (nodes.length === 0) {
      // If there are no nodes, create the first one
      const newNode = { id: 1, x: 50, y: 200 };
       // Set nodes to only the first node
      setNodes([newNode]);      
    } else if (nodes.length < 6) {
      // Get the index of the last node in the array and store in `lastNode` variable
      const lastNode = nodes[nodes.length - 1];
      const newNode = {
        id: lastNode.id + 1, // Increment the current `id` with 1
        x: lastNode.x + 100, // Increment the x coordinate of the `lastNode` with 100px (to the right)
        y: 200, // Maintain the same y coordinate
      };
      setNodes(
        [
        ...nodes // Spread operator to spread elements from old array into new array
        , newNode // New node object added to be added to the nodes array
        ]
      );
    }

    console.log(nodes.length);
  };

  const addEdge = () => {
    if (nodes.length > 1) {
      // Loop through all consecutive nodes and add an edge between them
      const newEdges = [];
  
      for (let i = 0; i < nodes.length - 1; i++) {
        const newEdge = {
          // Source as the `id` of the current index's node
          source: nodes[i].id,
          // Target as the `id` of the next index's node
          target: nodes[i + 1].id,
        };
  
        // The some() method checks if at least one element in the edges array matches a certain condition.
        const edgeExists = edges.some(edge =>
          // Example: Is there an edge going from Node 1 to Node 2?
          (edge.source === newEdge.source && edge.target === newEdge.target) ||
          // Example: Is there an edge going from Node 2 to Node 1?
          (edge.source === newEdge.target && edge.target === newEdge.source)
          // If either condition is true, it means an edge between Node 1 and Node 2 already exists (either direction), so edgeExists will be true.
        );
  
        // If there is no edge between two nodes
        if (!edgeExists) {
          newEdges.push(newEdge); 
        }
      }

      console.log(edges.length);
  
      setEdges([...edges, ...newEdges]); // Add all the new edges at once
    }
  };
  

  const removeNode = () => {
    if (nodes.length > 0) {
      setNodes(nodes.slice(0, -1)); // Remove the last node
      setEdges(edges.filter(edge => edge.source !== nodes[nodes.length - 1].id && edge.target !== nodes[nodes.length - 1].id)); // Remove associated edges
    }
  };

  const removeEdge = () => {
    if (edges.length > 0) {
      setEdges(edges.slice(0, -1)); // Remove the last edge
    }
  };


  return (
    <div>
        <div className="graph-network-container">
          <svg ref={svgRef} width="100%" height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}></svg>
        </div>
        <div className="graph-network-buttons">
          <button onClick={addNode}>Add Node</button>
          <button onClick={addEdge}>Add Edge</button>
          <button onClick={removeNode}>Remove Node</button>
          <button onClick={removeEdge}>Remove Edge</button>
        </div>
    </div>
  );
};

export default GraphNetwork;
