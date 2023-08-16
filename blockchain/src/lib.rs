use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint, entrypoint::ProgramResult, pubkey::Pubkey, program_error::ProgramError,
};

mod structs;
use structs::{Instruction, ProjectData};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = Instruction::unpack(instruction_data)?;

    match instruction {
        Instruction::SubmitProject {
            id,
            title,
            description,
            prototype_data,
            project_creators,
        } => {
            let project_data: ProjectData = ProjectData {
                id,
                title,
                description,
                prototype_data,
                project_creators,
                total_funding: 0,
                funders: Vec::new(),
            };
            submit_project(program_id, accounts, project_data)?;
        }
        Instruction::FundProject { project_id, amount } => {
            fund_project(program_id, accounts, project_id, amount)?;
        }
    }

    Ok(())
}

fn submit_project(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    project_data: ProjectData,
) -> ProgramResult {
    // Ensure that the accounts slice has the required accounts in the expected order
    if accounts.len() < 2 {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    let account_iter = &mut accounts.iter();
    let initializer = next_account_info(account_iter)?;
    let pda_account = next_account_info(account_iter)?;

    // Verify that the initializer is the signer
    if !initializer.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Check that the pda_account is owned by the program
    if pda_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Ensure the pda_account is not already initialized
    if !pda_account.data_is_empty() {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    // Serialize the project_data and update the pda_account data
    let data = project_data.serialize()?;
    pda_account.data.borrow_mut().copy_from_slice(&data);

    Ok(())
}


fn fund_project(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    project_id: u8,
    amount: u64,
) -> ProgramResult {
    // Ensure that the accounts slice has the required accounts in the expected order
    if accounts.len() < 3 {
        return Err(ProgramError::NotEnoughAccountKeys);
    }

    let account_iter = &mut accounts.iter();
    let initializer = next_account_info(account_iter)?;
    let pda_account = next_account_info(account_iter)?;
    let funding_account = next_account_info(account_iter)?;

    // Check that the funding account is owned by the system program
    if funding_account.owner != &solana_program::system_program::id() {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Check that the pda_account is not empty and that the provided project_id matches
    let mut project_data = ProjectData::deserialize(&pda_account.data.borrow())?;
    if pda_account.data_is_empty() || project_data.id != project_id {
        return Err(ProgramError::InvalidAccountData);
    }

    // Transfer funds from the funder's account to the project's funding account
    if funding_account.lamports() < amount {
        return Err(ProgramError::InsufficientFunds);
    }
    funding_account.try_borrow_mut_lamports()?.checked_sub(amount).unwrap();
    pda_account.try_borrow_mut_lamports()?.checked_add(amount).unwrap();

    // Update project's total_funding and funders list
    project_data.total_funding += amount;
    project_data.funders.push(initializer.key.to_string());

    // Serialize and update project data
    let data = project_data.serialize()?;
    pda_account.data.borrow_mut().copy_from_slice(&data);

    Ok(())
}

