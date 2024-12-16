const prices = {
  node: 300,
  credit: 500,
};

const bundles = [
  { name: 'Solo Bundle', credits: 2, nodes: 1, discount: 600, solo: true },
  { name: 'Entry Bundle', credits: 4, nodes: 4, discount: 1300 },
  { name: 'Dev Bundle', credits: 8, nodes: 5, discount: 1600 },
  { name: 'Team Bundle', credits: 4, nodes: 15, discount: 2000 },
  { name: 'Dev Bundle Plus', credits: 12, nodes: 10, discount: 2500 },
  { name: 'Team Bundle Plus', credits: 8, nodes: 20, discount: 3000 },
  { name: 'Business Bundle', credits: 12, nodes: 25, discount: 4000 },
];

export function calculatePrice(order) {
  for (const machine of order.machines) {
    machine.nodes = Math.ceil(machine.cores / 32);
    machine.price = (machine.floating ? 2 : 1) * machine.nodes * prices.node;
  }
  const nodePrice = order.machines.reduce((total, machine) => total + machine.price, 0);
  const relevantBundles = order.solo ? bundles : bundles.filter((bundle) => !bundle.solo);
  const totalPrice = order.credits * prices.credit + nodePrice;

  const bestBundle = relevantBundles.reduce(
    (best, bundle) => {
      const credits = Math.max(bundle.credits, order.credits);
      const nodes = Math.max(bundle.nodes, nodePrice / prices.node);
      const bundlePrice = credits * prices.credit + nodes * prices.node - bundle.discount;
      return bundlePrice < best.total
        ? { total: bundlePrice, discount: totalPrice - bundlePrice, bundle }
        : best;
    },
    { total: totalPrice, discount: 0, bundle: null },
  );

  return {
    ...bestBundle,
    credits: order.credits * prices.credit,
    nodes: nodePrice,
  };
}
