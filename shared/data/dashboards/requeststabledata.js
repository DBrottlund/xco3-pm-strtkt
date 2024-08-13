
"use client";

function createId() {
  return Math.random().toString(36).substring(2, 9);
}

export const requestSummaryData = [
    {
      id: createId(),
      title: "Train new recruit on dilithium recrystallization procedure",
      productTags: ["Onboarding", "Compliance"],
      initiativeTags: ["Cybersecurity", "API"],
      assigneeID: 1,
      intro: "Before starting the dilithium recrystallization procedure, it's essential to understand the importance of each step and the safety protocols involved. Dilithium crystals are a critical component in the operation of the warp core, and proper handling and recrystallization are vital for maintaining the stability and efficiency of the starship's propulsion system. This training will provide the recruit with a comprehensive understanding of the procedures, safety measures, and hands-on experience needed to perform recrystallization effectively and safely.",
      tasks: [
        {
          title: "Explain warpcore magnetic containment",
          text: "Provide a detailed explanation of the magnetic containment system used in the warpcore to stabilize the antimatter and matter reactions. Include diagrams and safety protocols."
        },
        {
          title: "Demonstrate dilithium crystal handling",
          text: "Show the proper techniques for handling dilithium crystals, including how to safely install and remove them from the warp core. Emphasize the importance of protective gear."
        },
        {
          title: "Review dilithium recrystallization process",
          text: "Walk through the step-by-step procedure for recrystallizing dilithium. Cover the necessary equipment, conditions required, and potential hazards to watch out for."
        },
        {
          title: "Conduct practical exercise on recrystallization",
          text: "Have the recruit perform a supervised recrystallization of a dilithium crystal. Provide guidance and feedback to ensure proper technique and safety are maintained throughout the process."
        }
      ],
      outro: "Completing the dilithium recrystallization procedure requires precision, attention to detail, and adherence to safety protocols. By following these steps, the recruit will gain the necessary skills and confidence to handle and recrystallize dilithium crystals effectively. Regular practice and continuous learning are encouraged to maintain proficiency in these critical operations. Remember, the safety and efficiency of the warp core depend on the proper execution of these procedures. Stay vigilant and always prioritize safety.",
      completedTasks: ["Explain warpcore magnetic containment"],
      status: 'viewed',
      original: "",
      generated: "",
      createdDate: "2024-08-05T10:30:00Z",
      startDate: "2024-08-06T14:30:00Z",
      turnaround: {
        period: 'hour',
        periodNum: 8
      },
      deadline: {
        period: 'day',
        periodNum: 2
      }
    },
    {
      id: createId(),
      title: "Upgrade warp core containment field",
      productTags: ["Backoffice", "Maintenance"],
      initiativeTags: ["Safety", "Backoffice"],
      assigneeID: 2,
      intro: "The warp core containment field is a critical component for the safe operation of a starship. Upgrading this field will enhance the stability and safety of the warp core, reducing the risk of containment breaches and improving overall efficiency. This task involves reviewing the current containment field, identifying potential weaknesses, and implementing necessary upgrades to ensure optimal performance.",
      tasks: [
        {
          title: "Inspect current containment field",
          text: "Perform a thorough inspection of the existing warp core containment field. Document any areas that show signs of wear or potential failure."
        },
        {
          title: "Research latest containment technologies",
          text: "Investigate the latest advancements in containment field technologies. Evaluate which solutions could be integrated into the current system."
        },
        {
          title: "Develop upgrade plan",
          text: "Create a detailed plan outlining the steps required to upgrade the containment field. Include necessary materials, safety protocols, and a timeline for implementation."
        },
        {
          title: "Implement upgrades",
          text: "Execute the upgrade plan, installing new components and making necessary adjustments to the containment field. Ensure all safety measures are strictly followed."
        }
      ],
      outro: "Upgrading the warp core containment field is essential for maintaining the safety and efficiency of the starship. By carefully inspecting, researching, and implementing the latest technologies, we can ensure the warp core operates within safe parameters. Continuous monitoring and regular maintenance are crucial to sustaining these improvements. Always prioritize safety and be vigilant for any signs of containment field degradation.",
      completedTasks: ["Inspect current containment field", "Research latest containment technologies"],
      status: 'pastDue',
      original: "",
      generated: "",
      createdDate: "2024-08-01T10:30:00Z",
      startDate: "2024-08-01T03:30:00Z",
      turnaround: {
        period: 'hour',
        periodNum: 12
      },
      deadline: {
        period: 'hour',
        periodNum: 20
      }
    },
    {
      id: createId(),
      title: "Optimize Teleporter Systems",
      productTags: ["Backoffice (general)", "Pipeline"],
      initiativeTags: ["UI", "Cybersecurity"],
      assigneeID: 3,
      intro: "Teleporter systems are crucial for the efficient and safe transportation of personnel and cargo on a starship. Optimizing these systems will ensure faster and more reliable teleportation, minimizing errors and enhancing overall operational efficiency. This task involves evaluating the current teleporter systems, identifying bottlenecks, and implementing improvements to boost performance and security.",
      tasks: [
        {
          title: "Assess current teleporter performance",
          text: "Conduct a comprehensive assessment of the existing teleporter systems. Measure teleportation accuracy, speed, and reliability, and document any issues or inefficiencies."
        },
        {
          title: "Research teleporter system advancements",
          text: "Explore the latest advancements in teleporter technology. Identify potential upgrades or modifications that could be applied to enhance system performance."
        },
        {
          title: "Develop optimization plan",
          text: "Create a detailed plan for optimizing the teleporter systems. Outline the steps required, necessary resources, and a timeline for implementation."
        },
        {
          title: "Implement teleporter optimizations",
          text: "Execute the optimization plan, making necessary adjustments and upgrades to the teleporter systems. Ensure all changes are thoroughly tested for safety and efficiency."
        }
      ],
      outro: "Optimizing the teleporter systems is essential for ensuring the smooth and efficient operation of the starship's transportation capabilities. By carefully assessing, researching, and implementing the latest technologies, we can significantly enhance teleporter performance and reliability. Continuous monitoring and regular updates will be necessary to maintain these improvements. Always prioritize safety and accuracy in all teleportation procedures.",
      completedTasks: ["Assess current teleporter performance", "Research teleporter system advancements", "Develop optimization plan", "Implement teleporter optimizations"],
      status: 'completed',
      original: "",
      generated: "",
      createdDate: "2024-08-02T10:30:00Z",
      startDate: "2024-08-05T03:30:00Z",
      turnaround: {
        period: 'day',
        periodNum: 1
      },
      deadline: {
        period: 'week',
        periodNum: 1
      }
    },
    {
      id: createId(),
      title: "Develop Strategy for Borg Adaptive Shield Deactivation",
      productTags: ["Analyst", "Compliance"],
      initiativeTags: ["API", "Cybersecurity"],
      assigneeID: 4,
      intro: "Borg adaptive shields are a formidable defense mechanism, constantly adjusting to counteract various types of attacks. Developing a strategy to deactivate these shields is critical for enhancing our tactical capabilities against Borg threats. This task involves analyzing the adaptive nature of Borg shields, identifying potential vulnerabilities, and creating a plan to exploit these weaknesses.",
      tasks: [
        {
          title: "Analyze Borg shield adaptation patterns",
          text: "Study the adaptation patterns of Borg shields during past encounters. Identify common responses to different types of attacks and document the findings."
        },
        {
          title: "Identify potential vulnerabilities",
          text: "Using the analysis of adaptation patterns, pinpoint potential weaknesses in the Borg shields. Consider unconventional methods and technologies that may exploit these vulnerabilities."
        },
        {
          title: "Develop deactivation plan",
          text: "Create a comprehensive plan for deactivating Borg adaptive shields. Include specific techniques, necessary equipment, and a step-by-step approach for implementation."
        }
      ],
      outro: "Successfully deactivating Borg adaptive shields requires a deep understanding of their adaptation mechanisms and innovative strategies to exploit identified vulnerabilities. This project will significantly enhance our defensive and offensive capabilities against Borg threats. Regular updates and refinements to the strategy will be essential as new information and technologies become available. Always prioritize thorough analysis and precise execution in these high-stakes operations.",
      completedTasks: ["Analyze Borg shield adaptation patterns"],
      status: 'assigned',
      original: "",
      generated: "",
      createdDate: "2024-08-02T00:30:00Z",
      startDate: "2024-08-05T18:30:00Z",
      turnaround: {
        period: 'day',
        periodNum: 3
      },
      deadline: {
        period: 'day',
        periodNum: 3
      }
    },
    {
      id: createId(),
      title: "Develop Strategy for Borg Adaptive Shield Deactivation",
      productTags: ["Analyst", "Compliance"],
      initiativeTags: ["API", "Cybersecurity"],
      assigneeID: 4,
      intro: "Borg adaptive shields are a formidable defense mechanism, constantly adjusting to counteract various types of attacks. Developing a strategy to deactivate these shields is critical for enhancing our tactical capabilities against Borg threats. This task involves analyzing the adaptive nature of Borg shields, identifying potential vulnerabilities, and creating a plan to exploit these weaknesses.",
      tasks: [
        {
          title: "Analyze Borg shield adaptation patterns",
          text: "Study the adaptation patterns of Borg shields during past encounters. Identify common responses to different types of attacks and document the findings."
        },
        {
          title: "Identify potential vulnerabilities",
          text: "Using the analysis of adaptation patterns, pinpoint potential weaknesses in the Borg shields. Consider unconventional methods and technologies that may exploit these vulnerabilities."
        },
        {
          title: "Develop deactivation plan",
          text: "Create a comprehensive plan for deactivating Borg adaptive shields. Include specific techniques, necessary equipment, and a step-by-step approach for implementation."
        }
      ],
      outro: "Successfully deactivating Borg adaptive shields requires a deep understanding of their adaptation mechanisms and innovative strategies to exploit identified vulnerabilities. This project will significantly enhance our defensive and offensive capabilities against Borg threats. Regular updates and refinements to the strategy will be essential as new information and technologies become available. Always prioritize thorough analysis and precise execution in these high-stakes operations.",
      completedTasks: [],
      status: 'request',
      original: "",
      generated: "",
      createdDate: "2024-08-02T00:30:00Z",
      startDate: "",
      turnaround: {
        period: 'day',
        periodNum: 3
      },
      deadline: {
        period: 'day',
        periodNum: 3
      }
    }
    
    
    ];