const exampleData = {
  start: {
    identity: {
      low: 209,
      high: 0,
    },
    labels: ['ProfilesRecipient'],
    properties: {
      name: 'eth9k',
      id: '0x000b66d64de039ea621834f4ea7197cc528fcc6b',
      profileImage: 'ipfs://QmRTYdZeU6fm7x9brfwHJnmL6cvjLgZvYUtbedFX29tNfs',
    },
    elementId: '4:41282d05-3ae6-4fa0-94cf-0bad47d76589:209',
  },
  end: {
    identity: {
      low: 310,
      high: 0,
    },
    labels: ['ProfilesSender'],
    properties: {
      name: 'soon',
      id: '0x000c3272b41f71a38624190a420e57618d4776fe',
      profileImage: 'ipfs://QmTVKVmn7Ap5Qi2Upzs2XY3kZ6UYro1Cy8S2oTHGojmCqw',
    },
    elementId: '4:41282d05-3ae6-4fa0-94cf-0bad47d76589:310',
  },
  segments: [
    {
      start: {
        identity: {
          low: 209,
          high: 0,
        },
        labels: ['ProfilesRecipient'],
        properties: {
          name: 'eth9k',
          id: '0x000b66d64de039ea621834f4ea7197cc528fcc6b',
          profileImage: 'ipfs://QmRTYdZeU6fm7x9brfwHJnmL6cvjLgZvYUtbedFX29tNfs',
        },
        elementId: '4:41282d05-3ae6-4fa0-94cf-0bad47d76589:209',
      },
      relationship: {
        identity: {
          low: 209,
          high: 268435456,
        },
        start: {
          low: 209,
          high: 0,
        },
        end: {
          low: 310,
          high: 0,
        },
        type: 'TX',
        properties: {},
        elementId: '5:41282d05-3ae6-4fa0-94cf-0bad47d76589:1152921504606847185',
        startNodeElementId: '4:41282d05-3ae6-4fa0-94cf-0bad47d76589:209',
        endNodeElementId: '4:41282d05-3ae6-4fa0-94cf-0bad47d76589:310',
      },
      end: {
        identity: {
          low: 310,
          high: 0,
        },
        labels: ['ProfilesSender'],
        properties: {
          name: 'soon',
          id: '0x000c3272b41f71a38624190a420e57618d4776fe',
          profileImage: 'ipfs://QmTVKVmn7Ap5Qi2Upzs2XY3kZ6UYro1Cy8S2oTHGojmCqw',
        },
        elementId: '4:41282d05-3ae6-4fa0-94cf-0bad47d76589:310',
      },
    },
  ],
  length: 1,
};

export default exampleData;
