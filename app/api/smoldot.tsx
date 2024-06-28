"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from "polkadot-api";
import { getSmProvider } from "polkadot-api/sm-provider";
import { startFromWorker } from "polkadot-api/smoldot/from-worker";
import { chainSpec as polkadot } from "polkadot-api/chains/polkadot";
import { chainSpec as westend2 } from "polkadot-api/chains/westend2";
import { chainSpec as ksmcc3 } from "polkadot-api/chains/ksmcc3";
import { chainSpec as rococo_v2_2 } from "polkadot-api/chains/rococo_v2_2";
import { chainSpec as polkadot_asset_hub } from "polkadot-api/chains/polkadot_asset_hub";


interface FinalizedBlock {
  number: number;
  hash: string;
}

interface ChainState {
  name: string;
  finalizedBlock: FinalizedBlock | null;
}

const chainSpecs = [
  { name: "rococo_v2_2 ", spec: rococo_v2_2 },
  { name: "ksmcc3", spec: ksmcc3  },
  { name: "polkadot_asset_hub", spec: polkadot_asset_hub  },
];

export default function MultiChainPolkadotClient() {
  const [chainStates, setChainStates] = useState<ChainState[]>([]);
  const [balance, setBalance] = useState<bigint | null>(null)
  useEffect(() => {
    const clients: any[] = [];

    async function initChain(name: string, chainSpec: any) {
      try {
        const SmWorker = new Worker(new URL('polkadot-api/smoldot/worker', import.meta.url));
        const smoldot = startFromWorker(SmWorker);
        const chain = await smoldot.addChain({ chainSpec });
        const client = createClient(getSmProvider(chain));

        const subscription = client.finalizedBlock$.subscribe((block) => {
          setChainStates((prevStates) => {
            const updatedStates = [...prevStates];
            const index = updatedStates.findIndex((state) => state.name === name);
            if (index !== -1) {
              updatedStates[index] = {
                name,
                finalizedBlock: {
                  number: block.number,
                  hash: block.hash.toString(),
                },
              };
            } else {
              updatedStates.push({
                name,
                finalizedBlock: {
                  number: block.number,
                  hash: block.hash.toString(),
                },
              });
            }
            return updatedStates;
          });
        });

        clients.push({ client, subscription });
      } catch (error) {
        console.error(`Error initializing ${name} client:`, error);
      }
    }

    chainSpecs.forEach((chain) => initChain(chain.name, chain.spec));

    // Clean up function
    return () => {
      clients.forEach(({ client, subscription }) => {
        subscription.unsubscribe();
        client.destroy();
      });
    };
  }, []);

  return (
    <div>
      <h2>Multi-chain Polkadot Client</h2>
      {chainStates.map((chainState) => (
        <div key={chainState.name}>
          <h3>{chainState.name}</h3>
          {chainState.finalizedBlock && (
            <p>
              Latest finalized block: {chainState.finalizedBlock.number} (
              {chainState.finalizedBlock.hash})
            </p>
          )}
        </div>
      ))}
    </div>
  );
}