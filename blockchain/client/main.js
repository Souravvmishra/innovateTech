const { Connection, PublicKey, Account, Transaction, TransactionInstruction } = require('@solana/web3.js');

// Solana network URL
const networkUrl = 'https://api.devnet.solana.com';

async function submitProject() {
    const connection = new Connection(networkUrl, 'confirmed');

    // Replace with your project data
    const projectData = {
        id: 1,
        title: 'My Project',
        description: 'A sample project description',
        prototype_data: 'Sample prototype data',
        project_creators: ['Creator 1', 'Creator 2'],
    };

    // Replace with your program ID and account keys
    const programId = new PublicKey('');
    const initializerAccount = new Account();
    const pdaAccount = new Account();    

    const instructionData = {
        submitProject: {
            id: projectData.id,
            title: projectData.title,
            description: projectData.description,
            prototype_data: projectData.prototype_data,
            project_creators: projectData.project_creators,
        },
    };

    const instruction = new TransactionInstruction({
        programId,
        keys: [
            { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: pdaAccount.publicKey, isSigner: false, isWritable: true },
        ],
        data: Buffer.from(JSON.stringify(instructionData)),
    });

    const transaction = new Transaction().add(instruction);

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [initializerAccount, pdaAccount]);

    console.log('Transaction Signature:', signature);
}

submitProject().catch(error => console.error(error));
