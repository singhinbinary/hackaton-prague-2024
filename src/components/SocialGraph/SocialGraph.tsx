import { useState } from 'react';
import neo4j from 'neo4j-driver';
import * as d3 from 'd3';

import exampleProfileData from '../../../data/exampleProfileData';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

const DEV_MODE = false;

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
      width = 2000 - margin.left - margin.right,
      height = 2000 - margin.top - margin.bottom;

    const nodes = graphData.nodes.map((d) => Object.create(d));
    const links = graphData.links.map((d) => Object.create(d));

    // Initialize the svg container
    const svg = d3
      .select('#my_dataviz svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .classed('svg-content-responsive', true);

    const defs = svg.append('svg:defs');

    // add one image for each node
    defs
      .selectAll('pattern')
      .data(nodes)
      .join((enter) => {
        // For every new <pattern>, set the constants and append an <image> tag
        const patterns = enter
          .append('pattern')
          .attr('width', 48)
          .attr('height', 48);

        patterns
          .append('image')
          .attr('width', 24)
          .attr('height', 24)
          .attr('x', -2.5)
          .attr('y', -2.5);

        return patterns;
      })
      // For every <pattern>, set it to point to the correct URL and have the correct ID
      .attr('id', (d) => d.id)
      .select('image')
      .datum((d) => {
        return d;
      })
      .attr('xlink:href', (d) => {
        return d.profileImage;
        // return 'https://api.universalprofile.cloud/ipfs/bafkreidslwzmoehiwdidwvevaxckoqsgo3hbq6fxwzobidmaexwvges3hi';
      });

    // Initialize the links
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', (d) => 1)
      .selectAll('line')
      .data(links)
      .join('line');

    // Construct the forces
    const forceNode = d3.forceManyBody();
    // const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => (d as any).id),
      )
      .force('charge', forceNode)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);
        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y); // TODO: which one should I
      });

    // Initialize the nodes
    const node = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-width', 1)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .style('fill', '#E5197F')
      .style('fill', (d) => `url(#${d.id})`)
      .attr('r', 10)
      .call(drag(simulation) as any);

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    // const circle = node
    //   .append('circle')
    //   .attr('r', 10)
    //   //   .attr('fill', (d) => 'black');
    //   .attr('width', 10)
    //   .attr('height', 10);

    // // const image = node
    // //   .append('svg:image')
    // //   .attr('width', 10)
    // //   .attr('height', 10)
    // //   .attr('xlink:href', function (d) {
    // //     return d.profileImage;
    // //   });

    return svg.node();
  };

  // TODO: put in service.js inside scripts
  const loadGraph = async () => {
    const URI = process.env.NEXT_PUBLIC_NEO4J_URI;
    const USER = process.env.NEXT_PUBLIC_NEO4J_USER;
    const PASSWORD = process.env.NEXT_PUBLIC_NEO4J_PASSWORD;

    if ([URI, USER, PASSWORD].includes(undefined)) {
      throw new Error('Missing some NEO4J Environnement variable');
    }

    let driver;

    try {
      let fetchedNodes: GraphNode[] = [];
      let fetchedLinks: GraphLink[] = [];

      // Fetch from Neo4j db if not in DEV mode
      if (!DEV_MODE) {
        driver = neo4j.driver(
          URI as string,
          neo4j.auth.basic(USER as string, PASSWORD as string),
        );
        const session = driver.session();

        const serverInfo = await driver.getServerInfo();
        console.log('Connection established');
        console.log(serverInfo);

        const result = await session.run(
          'MATCH p=()-[:TX]->() RETURN p LIMIT 1000;',
        );
        console.log('it worked! 👷🏻‍♂️', result);

        console.log('graphData before: ', graphData);
        result.records.map((record) => {
          const result = record.get('p');
          const { start, end, segments } = result;

          console.log('💙 start.properties: ', start.properties);
          console.log('🥺 end.properties: ', end.properties);

          //   if (start.properties.url == undefined) {
          //     console.log('no image for this UP ');
          //   } else {
          //     console.log('image url for UP 😁: ', start.properties.url);
          //   }

          const image: string | undefined = start.properties.url;
          const urlPrefix = 'https://api.universalprofile.cloud/image/';

          fetchedNodes.push({
            id: start.elementId,
            name: start.properties.name,
            // TODO: put LUKSO logo as default image
            // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtb1tp4eTrIgVGeyOP14oY2IrgP-5_kaQXdg&s
            profileImage: image
              ? urlPrefix + image.replace('ipfs://', '')
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtb1tp4eTrIgVGeyOP14oY2IrgP-5_kaQXdg&s',
          });
          fetchedNodes.push({
            id: end.elementId,
            name: end.properties.name,
            profileImage: image
              ? urlPrefix + image.replace('ipfs://', '')
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtb1tp4eTrIgVGeyOP14oY2IrgP-5_kaQXdg&s',
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
        const { start, end, segments } = exampleProfileData;

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
    <div>
      <div className="py-4">
        <Fab variant="extended">
          <NavigationIcon sx={{ mr: 1 }} />
          Connect 🆙
        </Fab>
      </div>
      <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
        <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
          Visualize Graph
        </h1>
        <div className="buttons">
          <Button
            variant="contained"
            onClick={() => {
              loadGraph().then(() => {
                createD3Graph();
              });
            }}
          >
            Load Graph Data.
          </Button>
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
    </div>
  );
}
