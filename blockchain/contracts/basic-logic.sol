// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundingPlatform {
    enum ProjectStatus { SUBMITTED, APPROVED, COMPLETED }

    struct Project {
        address creator;
        string title;
        string description;
        uint goalAmount;
        uint currentAmount;
        uint numBackers;
        ProjectStatus status;
    }

    struct Backer {
        address backerAddress;
        uint contribution;
    }

    mapping(address => Project) public projects;
    mapping(address => Backer) public backers;

    modifier projectExists(address _projectAddress) {
        require(projects[_projectAddress].creator != address(0), "Project does not exist");
        _;
    }

    function submitProject(string memory _title, string memory _description, uint _goalAmount) external {
        require(bytes(_title).length > 0 && bytes(_description).length > 0, "Title and description are required");
        require(_goalAmount > 0, "Goal amount must be greater than 0");

        Project storage newProject = projects[msg.sender];
        newProject.creator = msg.sender;
        newProject.title = _title;
        newProject.description = _description;
        newProject.goalAmount = _goalAmount;
        newProject.status = ProjectStatus.SUBMITTED;
    }

    function contributeToProject(address _projectAddress) external payable projectExists(_projectAddress) {
        Project storage project = projects[_projectAddress];
        require(project.status == ProjectStatus.APPROVED, "Project is not approved");
        require(msg.value > 0, "Contribution must be greater than 0");

        Backer storage backer = backers[msg.sender];
        if (backer.backerAddress == address(0)) {
            backer.backerAddress = msg.sender;
            project.numBackers++;
        }
        backer.contribution += msg.value;
        project.currentAmount += msg.value;
    }

    function approveProject(address _projectAddress) external projectExists(_projectAddress) {
        require(msg.sender == projects[_projectAddress].creator, "Only the project creator can approve");
        projects[_projectAddress].status = ProjectStatus.APPROVED;
    }

    function completeProject(address _projectAddress) external projectExists(_projectAddress) {
        Project storage project = projects[_projectAddress];
        require(msg.sender == project.creator, "Only the project creator can complete");
        require(project.currentAmount >= project.goalAmount, "Goal amount not reached");

        project.status = ProjectStatus.COMPLETED;
        payable(project.creator).transfer(project.currentAmount);
    }
}

