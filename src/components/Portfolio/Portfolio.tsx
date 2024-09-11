import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { formatUnits, JsonRpcProvider } from 'ethers';
import ERC725 from '@erc725/erc725.js';
import { Data } from '@erc725/erc725.js/build/main/src/types/decodeData';

// constants
import LSP5Schema from '@erc725/erc725.js/schemas/LSP5ReceivedAssets.json';
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import {
  INTERFACE_ID_LSP7,
  INTERFACE_ID_LSP7_PREVIOUS,
} from '@lukso/lsp7-contracts';
import {
  INTERFACE_ID_LSP8,
  INTERFACE_ID_LSP8_PREVIOUS,
} from '@lukso/lsp8-contracts';
import { LSP4_TOKEN_TYPES } from '@lukso/lsp4-contracts';

// components
import { Fab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';

// TODO: change that with input field
const PLACEHOLDER_ADDRESS = '0x927aad446e3bf6eeb776387b3d7a89d8016fa54d';

const RPC_URL = 'https://rpc.mainnet.lukso.network';
const provider = new JsonRpcProvider(RPC_URL);

type AssetInfos = {
  name: string;
  symbol: string;
  value: number;
};

export default function Portfolio() {
  const [lsp7Tokens, setLsp7Tokens] = useState<AssetInfos[]>([]);
  const [lsp7Collectibles, setLsp7Collectibles] = useState<AssetInfos[]>([]);
  const [lsp8NFTs, setLsp8NFTs] = useState<AssetInfos[]>([]);

  const [profileAddress, setProfileAddress] = useState(PLACEHOLDER_ADDRESS);

  const fetchLSP5Assets = async () => {
    const erc725js = new ERC725(
      LSP5Schema.concat(LSP4Schema),
      profileAddress,
      RPC_URL,
    );

    const { value: lsp5ReceivedAssets } = await erc725js.getData(
      'LSP5ReceivedAssets[]',
    );

    if (!lsp5ReceivedAssets) return;

    console.log('lsp5ReceivedAssets: ', lsp5ReceivedAssets);

    const lsp5MapResults = await erc725js.getData(
      (lsp5ReceivedAssets as string[]).map((assetAddress) => {
        return {
          keyName: 'LSP5ReceivedAssetsMap:<address>',
          dynamicKeyParts: [assetAddress],
        };
      }),
    );

    console.log('lsp5MapResults: ', lsp5MapResults);

    const lsp7TokensList: AssetInfos[] = [],
      lsp7CollectiblesList: AssetInfos[] = [],
      lsp8NFTs: AssetInfos[] = [];

    lsp5MapResults.forEach(async (lsp5AssetMapValue, index) => {
      const { value } = lsp5AssetMapValue;

      if (!value) return;

      const assetInterfaceId = (value as Data[])[0];

      const assetAddress = (lsp5ReceivedAssets as string[])[
        index
      ] as unknown as string;

      erc725js.options.address = assetAddress;
      let [{ value: assetName }, { value: assetSymbol }, { value: tokenType }] =
        await erc725js.getData([
          'LSP4TokenName',
          'LSP4TokenSymbol',
          'LSP4TokenType',
        ]);

      // TODO: put the actual balances but figure out a way to balance the pie chart
      // correctly otherwise, the LSP7 tokens balances are very large (e.g: 5,000)
      // and hide the visuals for the balances of NFTS that are smaller (e.g: 1, 8, etc...)
      const assetBalance = 1;

      if (
        [
          INTERFACE_ID_LSP7,
          ...Object.values(INTERFACE_ID_LSP7_PREVIOUS),
        ].includes(assetInterfaceId as string) &&
        (tokenType as unknown as number) == LSP4_TOKEN_TYPES.TOKEN
      ) {
        //   console.log(
        //     `${assetName} is an LSP7 Token, LSP4TokenType = ${tokenType} | asset address = ${(lsp5ReceivedAssets as string[])[index]}`,
        //   );
        lsp7TokensList.push({
          name: assetName as unknown as string,
          symbol: assetSymbol as unknown as string,
          value: assetBalance,
        });
      }
      if (
        [
          INTERFACE_ID_LSP7,
          ...Object.values(INTERFACE_ID_LSP7_PREVIOUS),
        ].includes(assetInterfaceId as string) &&
        (tokenType as unknown as number) == LSP4_TOKEN_TYPES.NFT
      ) {
        //   console.log(
        //     `${assetName} is an LSP7 Collectible, LSP4TokenType = ${tokenType} | asset address = ${(lsp5ReceivedAssets as string[])[index]}`,
        //   );
        lsp7CollectiblesList.push({
          name: assetName as unknown as string,
          symbol: assetSymbol as unknown as string,
          value: assetBalance,
        });
      }
      if (
        [
          INTERFACE_ID_LSP8,
          ...Object.values(INTERFACE_ID_LSP8_PREVIOUS),
        ].includes(assetInterfaceId as string)
      ) {
        //   console.log(
        //     `${assetName} is an LSP8 NFT, LSP4TokenType = ${tokenType} | asset address = ${(lsp5ReceivedAssets as string[])[index]}`,
        //   );
        lsp8NFTs.push({
          name: assetName as unknown as string,
          symbol: assetSymbol as unknown as string,
          value: assetBalance,
        });
      }
    });

    setLsp7Tokens(lsp7TokensList);
    setLsp7Collectibles(lsp7CollectiblesList);
    setLsp8NFTs(lsp8NFTs);
  };

  //   useEffect(() => {
  //     fetchLSP5Assets();
  //   }, []);

  const createD3PieChart = async () => {
    const lyxBalance = await provider.getBalance(profileAddress);
    const formattedLyxBalance = formatUnits(lyxBalance);

    const data = {
      name: 'portfolio',
      children: [
        { name: 'LYX', value: formattedLyxBalance },
        {
          name: 'LSP7 Tokens',
          children: lsp7Tokens,
        },
        {
          name: 'LSP7 Collectibles',
          children: lsp7Collectibles,
        },
        {
          name: 'LSP8 NFTs',
          children: lsp8NFTs,
        },
      ],
    };

    const margin = { top: 5, right: 5, bottom: 5, left: 5 },
      width = 1000 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;
    const radius = 928 / 2;

    // create the color scale
    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1),
    );

    // prepare and compute the layout
    const partition = () =>
      d3.partition().size([2 * Math.PI, radius])(
        d3
          .hierarchy(data as any)
          .sum((d: any) => d.value)
          .sort((a: any, b: any) => b.value - a.value),
      );

    // create the arc generator
    const arc = d3
      .arc()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius((d: any) => d.y0)
      .outerRadius((d: any) => d.y1 - 1);

    const root = partition();

    // create the SVG container
    const svg = d3
      .select('#portfolio_visualization svg')
      .attr('viewBox', [-width / 2, -height / 2, width, width]);

    svg.selectAll('g').remove();
    // .style('font', '10px sans-serif');

    // add an arc for each element, with a title for tooltips
    const format = d3.format(',d');
    svg
      .append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('path')
      .data(root.descendants().filter((d: any) => d.depth))
      .join('path')
      .attr('fill', (d: any) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr('d', arc as any)
      .append('title')
      .text(
        (d: any) =>
          `${d
            .ancestors()
            .map((d: any) => d.data.name)
            .reverse()
            .join('/')}\n${format(d.value)}`,
      );

    // Add a label for each element.
    svg
      .append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
      .selectAll('text')
      .data(
        root
          .descendants()
          .filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10),
      )
      .join('text')
      .attr('transform', function (d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('dy', '0.35em')
      .text((d: any) => d.data.name);

    // The autoBox function adjusts the SVG’s viewBox to the dimensions of its contents.
    // svg.attr('viewBox', [0, 0, width, height]).node();
  };

  return (
    <div>
      <div className="py-4">
        <button
          onClick={() => fetchLSP5Assets().then(() => createD3PieChart())}
        >
          <Fab variant="extended" className="mx-3">
            <SearchIcon sx={{ mr: 1 }} onClick={() => createD3PieChart()} />
            Connect
          </Fab>
          <TextField
            label="Enter your address"
            className="mx-3"
            style={{ width: '30rem' }}
            onChange={(event) => setProfileAddress(event.target.value)}
          />
          <Fab variant="extended" className="mx-3">
            <SearchIcon sx={{ mr: 1 }} />
            Visualise Portfolio
          </Fab>
        </button>
      </div>
      <div className="h-full bg-gray-100 bg-opacity-75 px-8 py-16 my-10 pb-24 rounded-lg overflow-hidden text-center relative">
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <div
            id="portfolio_visualization"
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
