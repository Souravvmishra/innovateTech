const { Connection, PublicKey, Keypair, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Solana network URL
//const networkUrl = 'https://api.devnet.solana.com';
const networkUrl = 'http://127.0.0.1:8899';

async function createPdaAccount(seedInfo) {
    const connection = new Connection(networkUrl, 'confirmed');

    // Replace with your program ID and account keys
    const programId = new PublicKey('5kBNQqvNeJDYurxktaTVSB6ZjiAGuBwbR1HzEWKcKP5');
    // const initializerAccount = Keypair.generate(); // A new account to be used as the initializer


    let secretKey = Uint8Array.from([211, 24, 17, 4, 217, 66, 191, 237, 29, 35, 5, 188, 88, 143, 186, 86, 7, 103, 93, 241, 23, 5, 75, 89, 209, 131, 130, 126, 133, 21, 161, 101, 170, 31, 172, 32, 225, 190, 109, 115, 19, 213, 50, 169, 182, 71, 105, 190, 164, 50, 75, 187, 133, 201, 60, 200, 22, 225, 71, 168, 240, 255, 56, 108]);

    let initializerAccount = Keypair.fromSecretKey(secretKey);

    const pdaSeed = seedInfo + '-pda-seed';
    const pdaAccount = await PublicKey.createWithSeed(initializerAccount.publicKey, pdaSeed, programId);

    // Create a new PDA account
    const lamports = 1000000; // Amount of lamports to allocate for the PDA account
    const rent = await connection.getMinimumBalanceForRentExemption(100); // Get rent exemption threshold
    const transaction = new Transaction().add(
        SystemProgram.createAccountWithSeed({
            fromPubkey: initializerAccount.publicKey,
            basePubkey: initializerAccount.publicKey,
            seed: pdaSeed,
            newAccountPubkey: pdaAccount,
            lamports: lamports + rent, // Include rent in the allocated lamports
            space: 100, // Replace with the required space
            programId,
        })
    );

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [initializerAccount], {
        skipPreflight: false, // Set to true if you encounter preflight errors
        preflightCommitment: 'confirmed', // Adjust as needed
    });

    console.log('PDA Account Created:', pdaAccount.toBase58(), "signature: ", signature);
    return pdaAccount;
}

async function createProject() {
    const connection = new Connection(networkUrl, 'confirmed');

    // Replace with your program ID and account keys
    const programId = new PublicKey('5kBNQqvNeJDYurxktaTVSB6ZjiAGuBwbR1HzEWKcKP5');
    let secretKey = Uint8Array.from([211, 24, 17, 4, 217, 66, 191, 237, 29, 35, 5, 188, 88, 143, 186, 86, 7, 103, 93, 241, 23, 5, 75, 89, 209, 131, 130, 126, 133, 21, 161, 101, 170, 31, 172, 32, 225, 190, 109, 115, 19, 213, 50, 169, 182, 71, 105, 190, 164, 50, 75, 187, 133, 201, 60, 200, 22, 225, 71, 168, 240, 255, 56, 108]);

    let initializerAccount = Keypair.fromSecretKey(secretKey);

    // Replace with your project data
    const projectData = {
        id: 1,
        title: 'My Project',
        description: 'A sample project description',
        prototype_data: 'Sample prototype data',
        project_creators: ['Creator 1', 'Creator 2'],
    };

    const pdaAccount = await createPdaAccount(projectData.id.toString());

    const instructionData = {
        submitProject: {
            id: projectData.id,
            title: projectData.title,
            description: projectData.description,
            prototype_data: projectData.prototype_data,
            project_creators: projectData.project_creators,
        },
    };

    // Create a TransactionInstruction to submit the project data
    const instruction = new TransactionInstruction({
        programId,
        keys: [
            { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: pdaAccount, isSigner: false, isWritable: true },
        ],
        data: Buffer.from([0, ...Buffer.from(JSON.stringify(instructionData))]), // First byte is operation type
    });

    // Create a Transaction containing the instruction
    const transaction = new Transaction().add(instruction);

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [initializerAccount], {
        skipPreflight: false, // Set to true if you encounter preflight errors
        preflightCommitment: 'confirmed', // Adjust as needed
    });

    console.log('Transaction Signature:', signature);
}

createProject().catch(error => console.error(error));
