import { useState } from 'react';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

import exampleData from './exampleData';

const DEV_MODE = false;

// librairies
import neo4j from 'neo4j-driver';
import * as d3 from 'd3';

dotenvConfig();

type GraphNode = { id: string; name: string; profileImage: string };
type GraphLink = { source: string; target: string };

export default function SocialGraph() {
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
    const margin = { top: 5, right: 5, bottom: 5, left: 5 },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const nodes = graphData.nodes.map((d) => Object.create(d));
    const links = graphData.links.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => (d as any).id),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const svg = d3
      .select('#my_dataviz svg')
      .attr('viewBox', [0, 0, width, height]);

    // Initialize the nodes
    const nodeContainer = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .selectAll('.node')
      .data(nodes, (d) => (d as any).id)
      .attr('class', 'node')
      .join('g');

    // Initialize the links
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    const circle = nodeContainer
      .append('circle')
      .attr('r', 10)
      .attr('fill', (d) => 'black');

    const image = nodeContainer
      .append('svg:image')
      .attr('width', 10)
      .attr('height', 10)
      .attr('xlink:href', function (d) {
        return d.profileImage;
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
      image.attr('x', (d) => d.x - 5).attr('y', (d) => d.y - 5);

      circle.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });

    return svg.node();
  };

  // TODO: put in service.js inside scripts
  const loadGraph = async () => {
    // TODO: fetch from .env file
    const URI = 'neo4j+s://1a0611a2.databases.neo4j.io:7687';
    const USER = 'neo4j';
    const PASSWORD = 'rPc1gSqxHIuiQYZidMvKHOUtxRGx0PwTmJwdnOtMB2M';

    console.log('URI', URI);
    console.log('USER', USER);
    console.log('PASSWORD', PASSWORD);

    let driver;

    try {
      let fetchedNodes: GraphNode[] = [];
      let fetchedLinks: GraphLink[] = [];

      // Fetch from Neo4j db if not in DEV mode
      if (!DEV_MODE) {
        driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
        const session = driver.session();

        const serverInfo = await driver.getServerInfo();
        console.log('Connection established');
        console.log(serverInfo);

        const result = await session.run(
          'MATCH p=()-[:TX]->() RETURN p LIMIT 200;',
        );
        console.log('it worked! 👷🏻‍♂️', result);

        console.log('graphData before: ', graphData);
        result.records.map((record) => {
          const result = record.get('p');
          const { start, end, segments } = result;

          // console.log('start.properties', start.properties);
          // console.log('end.properties', end.properties);

          fetchedNodes.push({
            id: start.elementId,
            name: start.properties.name,
            profileImage:
              'https://api.universalprofile.cloud/ipfs/' +
                String(start.properties.url).replace('ipfs://', '') || '',
          });
          fetchedNodes.push({
            id: end.elementId,
            name: end.properties.name,
            profileImage: '',
          });

          segments.map((segment: any) => {
            fetchedLinks.push({
              source: segment.start.elementId,
              target: segment.end.elementId,
            });
          });
          session.close();
        });
      } else {
        const { start, end, segments } = exampleData;

        fetchedNodes.push({
          id: start.elementId,
          name: start.properties.name,
          profileImage:
            'https://api.universalprofile.cloud/ipfs/' +
            start.properties.profileImage.replace('ipfs://', ''),
        });
        fetchedNodes.push({
          id: end.elementId,
          name: end.properties.name,
          profileImage:
            'https://api.universalprofile.cloud/ipfs/' +
            end.properties.profileImage.replace('ipfs://', ''),
        });

        segments.map((segment: any) => {
          fetchedLinks.push({
            source: segment.start.elementId,
            target: segment.end.elementId,
          });
        });
      }

      setGraphData({ nodes: fetchedNodes, links: fetchedLinks });
      console.log('graphData after: ', graphData);
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
        <div
          id="my_dataviz"
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
          }}
        >
          <svg></svg>
        </div>
      </div>
    </div>
  );
}
