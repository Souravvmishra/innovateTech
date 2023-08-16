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
        BorshDeserialize::try_from_slice(input).map_err(|_| ProgramError::InvalidInstructionData)
    }
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
