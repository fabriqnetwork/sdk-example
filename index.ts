import { IntentClient, getSupportedChainByID, getTestnetTokensByChainID, createItem } from '@fabriqnetwork/sdk';
import { createWalletClient, Hex, http, WalletClient, parseUnits } from 'viem';
import { optimismSepolia, sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// reach out on discord to get some testnet tokens
const intentPoolURL = 'io.fabriq.sh:9997';

async function main() {
	const privateKey = process.argv[2] as Hex

	const walletClientSepolia: WalletClient = createWalletClient({
		account: privateKeyToAccount(privateKey),
		chain: sepolia,
		transport: http(),
	});

	// get fabriq contract deployments for sepolia 
	const sepoliaInfo = await getSupportedChainByID(sepolia.id);

	const tokensSepolia = await getTestnetTokensByChainID(sepolia.id);
	const tokensOptimismSepolia = await getTestnetTokensByChainID(optimismSepolia.id);

	// the IntentClient is used to create and submit intents
	const intentClientSepolia = new IntentClient(walletClientSepolia, intentPoolURL, sepoliaInfo);

	// fabriq uses permit2 for gasless token alowances
	// if the permit2 contract is already approved, this does not do anything
	await intentClientSepolia.approvePermit2(tokensSepolia.Ceres);

	// the solver will only solve profitable orders, that's why the output is lower than the input
	const inAmount = parseUnits('2.00', 18);
	const outAmount = parseUnits('1.90', 18);

	// submitting an intent to bridge Ceres from Sepolia to OP Sepolia 
	// the 2 amounts in each Item specify a dutch auction
	// by setting them to the same value we create a static price
	const input = createItem(tokensSepolia.Ceres, inAmount, inAmount, sepolia.id);
	const output = createItem(tokensOptimismSepolia.Ceres, outAmount, outAmount, optimismSepolia.id)
	// intents have can multiple outputs, in that case exactly one output will be filled 
	// outputs can be on the same or on different chains
	await intentClientSepolia.submitIntent(input, [output]);
}

main()
	.then(() => {
		console.log('successfully submitted intent');
	})
	.catch((error) => {
		console.error('Error:', error);
	});
