use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

#[derive(Debug, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum Instruction {
    SubmitProject {
        id: u8,
        title: String,
        description: String,
        prototype_data: String,
        project_creators: Vec<String>,
    },
    FundProject {
        project_id: u8,
        amount: u64,
    },
}

impl Instruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let operation_type = input[0];
        match operation_type {
            0 => {
                let submit_data = SubmitProjectData::try_from_slice(&input[1..])?;
                Ok(Instruction::SubmitProject {
                    id: submit_data.id,
                    title: submit_data.title,
                    description: submit_data.description,
                    prototype_data: submit_data.prototype_data,
                    project_creators: submit_data.project_creators,
                })
            }
            1 => {
                let fund_data = FundProjectData::try_from_slice(&input[1..])?;
                Ok(Instruction::FundProject {
                    project_id: fund_data.project_id,
                    amount: fund_data.amount,
                })
            }
            _ => {
                return Err(ProgramError::InvalidInstructionData);
            }
        }
    }
}

#[derive(Debug, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct SubmitProjectData {
    pub id: u8,
    pub title: String,
    pub description: String,
    pub prototype_data: String,
    pub project_creators: Vec<String>,
}

#[derive(Debug, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct FundProjectData {
    pub project_id: u8,
    pub amount: u64,
}

#[derive(Debug, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct ProjectData {
    pub id: u8,
    pub title: String,
    pub description: String,
    pub prototype_data: String,
    pub project_creators: Vec<String>,
    pub total_funding: u64,
    pub funders: Vec<String>,
}

impl ProjectData {
    pub fn serialize(&self) -> Result<Vec<u8>, ProgramError> {
        BorshSerialize::try_to_vec(&self).map_err(|_| ProgramError::InvalidAccountData)
    }

    pub fn deserialize(data: &[u8]) -> Result<Self, ProgramError> {
        BorshDeserialize::try_from_slice(data).map_err(|_| ProgramError::InvalidAccountData)
    }
}
