import { useState } from 'react';
import styles from './style.module.css';

// librairies
import neo4j from 'neo4j-driver';
import * as d3 from 'd3';

type GraphNode = { id: string; name: string };
type GraphLink = { source: string; target: string };

export default function RightColumn() {
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    links: GraphLink[];
  }>({
    nodes: [],
    links: [],
  });

  // TODO: put in service.js inside scripts
  const createD3Graph = () => {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select('#my_dataviz')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // TODO: load from the component state
    // d3.json(graphData).then(function (data) {
    // Initialize the links
    const link = svg
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .style('stroke', '#aaa');

    // Initialize the nodes
    const node = svg
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', 10)
      .style('fill', '#69b3a2');

    // Let's list the force we wanna apply on the network
    const simulation = d3
      .forceSimulation(graphData.nodes as any) // Force algorithm is applied to data.nodes
      .force(
        'link',
        d3
          .forceLink() // This force provides links between nodes
          .id(function (d: any) {
            return d.id;
          }) // This provide  the id of a node
          .links(graphData.links), // and this the list of links
      )
      .force('charge', d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .on('end', ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
      link
        .attr('x1', function (d: any) {
          return (d.source as any).x;
        })
        .attr('y1', function (d) {
          return (d.source as any).y;
        })
        .attr('x2', function (d) {
          return (d.target as any).x;
        })
        .attr('y2', function (d) {
          return (d.target as any).y;
        });

      node
        .attr('cx', function (d) {
          return (d as any).x + 6;
        })
        .attr('cy', function (d) {
          return (d as any).y - 6;
        });
    }
    // });
  };

  // TODO: put in service.js inside scripts
  const loadGraph = async () => {
    // // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
    // const URI = 'neo4j+s://ff552082.databases.neo4j.io';
    // // const URI = 'bolt://localhost';
    // const USER = 'neo4j';
    // const PASSWORD = 'LCWZKz0r5Hlq82CZ2k3ZR5Mw-50fSrWeze-Q-epapsM';

    const URI = 'neo4j+s://8a4ff738.databases.neo4j.io:7687';
    const USER = 'neo4j';
    const PASSWORD = 'N1eSLXyxqhv2npaZZWiokgv6OhciMHk7g5upYQBJjNo';

    let driver;

    try {
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
      const session = driver.session();

      const serverInfo = await driver.getServerInfo();
      console.log('Connection established');
      console.log(serverInfo);

      let fetchedNodes: GraphNode[] = [];
      let fetchedLinks: GraphLink[] = [];

      const result = await session.run(
        'MATCH p=()-[:TX]->() RETURN p LIMIT 200;',
      );
      console.log('it worked! 👷🏻‍♂️', result);

      console.log('graphData before: ', graphData);
      result.records.map((record) => {
        const result = record.get('p');
        // fetchedNodes.push({})
        const { start, end, segments } = result;

        fetchedNodes.push({
          id: start.elementId,
          name: start.properties.name,
        });
        fetchedNodes.push({
          id: end.elementId,
          name: end.properties.name,
        });

        segments.map((segment: any) => {
          fetchedLinks.push({
            source: segment.start.elementId,
            target: segment.end.elementId,
          });
        });
      });

      setGraphData({ nodes: fetchedNodes, links: fetchedLinks });
      console.log('graphData after: ', graphData);

      session.close();
    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err}`);
    }
  };

  return (
    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
        Visualize Graph
      </h1>
      <div className="buttons">
        <button
          className="button is-info is-light"
          onClick={() => {
            loadGraph().then(() => {
              createD3Graph();
            });
          }}
        >
          Load Graph Data. Lets go! 🪂
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <div id="my_dataviz"></div>
      </div>
    </div>
  );
}
