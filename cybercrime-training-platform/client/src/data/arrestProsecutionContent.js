/**
 * Arrest and Prosecution Simulation Content
 * 
 * This file contains the content for the arrest and prosecution simulation (Level 5)
 * of the Financial Fraud Investigation module.
 */

// Interstate coordination workflow data
export const interstateCoordinationData = {
  title: "Interstate Coordination Workflow",
  description: "Coordinate with police departments across state lines to apprehend the suspect.",
  steps: [
    {
      id: "step1",
      title: "Initial Coordination",
      description: "Establish contact with the police department in the suspect's jurisdiction.",
      options: [
        {
          id: "option1",
          text: "Send an official email with case details",
          isCorrect: false,
          feedback: "Email is too slow for urgent coordination. A direct call is more appropriate."
        },
        {
          id: "option2",
          text: "Call the jurisdiction's cybercrime cell directly",
          isCorrect: true,
          feedback: "Correct! Direct phone contact ensures immediate attention and allows for real-time coordination."
        },
        {
          id: "option3",
          text: "Wait for your superior to handle the coordination",
          isCorrect: false,
          feedback: "This delays the process unnecessarily. As the investigating officer, you should initiate contact."
        }
      ]
    },
    {
      id: "step2",
      title: "Information Sharing",
      description: "Share necessary information with the cooperating department.",
      options: [
        {
          id: "option1",
          text: "Share all case details including victim information",
          isCorrect: false,
          feedback: "Sharing all details including sensitive victim information violates privacy protocols."
        },
        {
          id: "option2",
          text: "Share only suspect details and evidence relevant to apprehension",
          isCorrect: true,
          feedback: "Correct! Share only what's necessary for the apprehension operation."
        },
        {
          id: "option3",
          text: "Share minimal information to maintain case secrecy",
          isCorrect: false,
          feedback: "Insufficient information sharing can hamper the coordination effort."
        }
      ]
    },
    {
      id: "step3",
      title: "Jurisdiction Handover",
      description: "Determine how to handle the suspect after apprehension.",
      options: [
        {
          id: "option1",
          text: "Request immediate transfer to your jurisdiction",
          isCorrect: false,
          feedback: "Immediate transfer without proper documentation can create legal complications."
        },
        {
          id: "option2",
          text: "Allow local police to handle the entire case",
          isCorrect: false,
          feedback: "This abandons your jurisdiction's interest in the case where the crime primarily occurred."
        },
        {
          id: "option3",
          text: "Coordinate for proper transit warrant and transfer procedures",
          isCorrect: true,
          feedback: "Correct! Following proper transit warrant procedures ensures legal compliance."
        }
      ]
    },
    {
      id: "step4",
      title: "Joint Operation Planning",
      description: "Plan the apprehension operation with the cooperating department.",
      options: [
        {
          id: "option1",
          text: "Let the local department handle the operation independently",
          isCorrect: false,
          feedback: "This misses the opportunity for your expertise and case knowledge to assist."
        },
        {
          id: "option2",
          text: "Take over the operation completely upon arrival",
          isCorrect: false,
          feedback: "This disrespects local jurisdiction authority and expertise."
        },
        {
          id: "option3",
          text: "Plan a joint operation with clearly defined roles",
          isCorrect: true,
          feedback: "Correct! A joint operation leverages both departments' strengths and respects jurisdictional boundaries."
        }
      ]
    }
  ]
};

// Suspect interrogation dialog data
export const suspectInterrogationData = {
  title: "Suspect Interrogation",
  description: "Conduct an effective interrogation to gather evidence and build your case.",
  scenario: {
    title: "Interrogation of Financial Fraud Suspect",
    description: "You are interrogating Rajesh Kumar, suspected of operating as a money mule in a Rs. 2.5 lakh fraud case. He claims to be unaware that his bank account was used for illegal activities.",
    context: "The interrogation takes place at the police station after the suspect has been apprehended. You have evidence of multiple suspicious transactions through his account."
  },
  characters: [
    {
      id: "officer",
      name: "Investigating Officer",
      role: "police",
      description: "You, the cybercrime investigating officer",
      avatarUrl: "/assets/images/characters/officer.png",
      emotionalState: "neutral"
    },
    {
      id: "suspect",
      name: "Rajesh Kumar",
      role: "suspect",
      description: "The suspect, a 32-year-old bank employee who claims innocence",
      avatarUrl: "/assets/images/characters/suspect.png",
      emotionalState: "anxious"
    }
  ],
  interactions: [
    {
      id: "intro",
      type: "dialog",
      character: "officer",
      text: "Mr. Kumar, I'm investigating a cybercrime case involving fraudulent transactions through your bank account. Do you understand why you're here today?",
      options: [
        {
          id: "proceed",
          text: "Continue",
          nextInteractionId: "suspect_response1"
        }
      ]
    },
    {
      id: "suspect_response1",
      type: "dialog",
      character: "suspect",
      text: "Yes, but I don't understand why I'm being treated like a criminal. I didn't do anything wrong. Someone must have used my account without my knowledge.",
      options: [
        {
          id: "aggressive",
          text: "We have evidence that you received money multiple times. Stop lying!",
          points: -10,
          feedback: "Aggressive approach may cause the suspect to become defensive and less cooperative.",
          nextInteractionId: "suspect_defensive"
        },
        {
          id: "neutral",
          text: "We've traced multiple suspicious transactions through your account over the past month. Can you explain these?",
          points: 10,
          feedback: "Professional approach that presents evidence while allowing the suspect to respond.",
          nextInteractionId: "suspect_explanation"
        },
        {
          id: "sympathetic",
          text: "I understand this might be confusing. Let's go through what we know to clear things up.",
          points: 5,
          feedback: "Sympathetic approach may build rapport but doesn't directly address the evidence.",
          nextInteractionId: "suspect_cautious"
        }
      ]
    },
    {
      id: "suspect_defensive",
      type: "dialog",
      character: "suspect",
      text: "I'm not lying! You can't just accuse people like this. I want a lawyer!",
      emotionalState: "angry",
      options: [
        {
          id: "backtrack",
          text: "Let's calm down and look at the evidence objectively.",
          points: 0,
          nextInteractionId: "evidence_presentation"
        },
        {
          id: "continue_aggressive",
          text: "Fine, get a lawyer. It won't change the evidence we have.",
          points: -15,
          nextInteractionId: "interrogation_stalled"
        }
      ]
    },
    {
      id: "suspect_explanation",
      type: "dialog",
      character: "suspect",
      text: "What transactions? I just use my account for salary and regular expenses. Maybe someone hacked my account?",
      emotionalState: "worried",
      options: [
        {
          id: "show_evidence",
          text: "Show the transaction records with dates and amounts",
          points: 15,
          nextInteractionId: "evidence_presentation"
        },
        {
          id: "question_lifestyle",
          text: "Ask about recent expensive purchases that don't match his income",
          points: 10,
          nextInteractionId: "lifestyle_questioning"
        }
      ]
    },
    {
      id: "suspect_cautious",
      type: "dialog",
      character: "suspect",
      text: "Okay... I'm willing to cooperate. What exactly do you think happened?",
      emotionalState: "calm",
      options: [
        {
          id: "explain_case",
          text: "Explain the fraud case and his account's involvement",
          points: 10,
          nextInteractionId: "case_explanation"
        }
      ]
    },
    {
      id: "evidence_presentation",
      type: "dialog",
      character: "officer",
      text: "Here are the transaction records. Your account received Rs. 2.5 lakh in multiple deposits, which were then quickly transferred to various other accounts. This is a classic money mule pattern.",
      options: [
        {
          id: "observe_reaction",
          text: "Observe the suspect's reaction carefully",
          points: 5,
          nextInteractionId: "suspect_reaction"
        },
        {
          id: "ask_directly",
          text: "Ask directly: 'Who asked you to make these transfers?'",
          points: 10,
          nextInteractionId: "suspect_pressured"
        }
      ]
    },
    {
      id: "suspect_reaction",
      type: "dialog",
      character: "suspect",
      text: "[The suspect looks nervous and avoids eye contact] I... I didn't realize... Maybe someone used my online banking credentials?",
      emotionalState: "nervous",
      options: [
        {
          id: "point_out_behavior",
          text: "Point out his nervous behavior as a sign of deception",
          points: -5,
          nextInteractionId: "suspect_defensive"
        },
        {
          id: "offer_cooperation",
          text: "Offer reduced consequences for cooperation and identifying the main perpetrators",
          points: 20,
          nextInteractionId: "suspect_considering"
        }
      ]
    },
    {
      id: "suspect_pressured",
      type: "dialog",
      character: "suspect",
      text: "Nobody! I told you I don't know anything about these transfers!",
      emotionalState: "stressed",
      options: [
        {
          id: "present_more_evidence",
          text: "Present evidence of his communication with the main fraudster",
          points: 15,
          nextInteractionId: "suspect_cornered"
        },
        {
          id: "take_break",
          text: "Suggest a break and time to reconsider his statement",
          points: 5,
          nextInteractionId: "interrogation_break"
        }
      ]
    },
    {
      id: "suspect_considering",
      type: "dialog",
      character: "suspect",
      text: "What... what kind of cooperation are you talking about? What would happen to me?",
      emotionalState: "hopeful",
      options: [
        {
          id: "explain_cooperation",
          text: "Explain the benefits of cooperation in detail",
          points: 10,
          nextInteractionId: "cooperation_explanation"
        }
      ]
    },
    {
      id: "cooperation_explanation",
      type: "dialog",
      character: "officer",
      text: "If you provide information that helps us catch the main perpetrators, the prosecutor will be informed of your cooperation. This could potentially result in reduced charges. However, I need complete honesty from you now.",
      options: [
        {
          id: "wait_for_response",
          text: "Wait for the suspect's decision",
          points: 5,
          nextInteractionId: "suspect_confession"
        }
      ]
    },
    {
      id: "suspect_confession",
      type: "dialog",
      character: "suspect",
      text: "[Sighs] Okay. A man contacted me online, said he'd pay me 10% to receive and transfer money. He said it was for a business that wanted to avoid taxes. I needed the money... I didn't know it was stolen.",
      emotionalState: "regretful",
      options: [
        {
          id: "gather_details",
          text: "Gather detailed information about the mastermind",
          points: 25,
          nextInteractionId: "interrogation_successful"
        },
        {
          id: "express_doubt",
          text: "Express doubt about his claim of ignorance",
          points: -10,
          nextInteractionId: "suspect_defensive"
        }
      ]
    },
    {
      id: "interrogation_successful",
      type: "dialog",
      character: "officer",
      text: "Thank you for your cooperation. We'll need you to provide a formal statement and all the communication details you have with this person. This will significantly help our investigation.",
      options: [
        {
          id: "conclude",
          text: "Conclude the interrogation and proceed to formal statement",
          points: 10,
          nextInteractionId: "interrogation_complete"
        }
      ]
    },
    {
      id: "interrogation_complete",
      type: "result",
      result: {
        title: "Interrogation Successful",
        description: "You successfully obtained a confession and valuable information about the main perpetrator. This will significantly strengthen your case and help track down the mastermind behind the fraud operation.",
        score: 100
      }
    },
    {
      id: "interrogation_stalled",
      type: "result",
      result: {
        title: "Interrogation Stalled",
        description: "The suspect has requested legal representation and is no longer cooperating. You'll need to wait for their lawyer and reconsider your approach. This has delayed your investigation.",
        score: 30
      }
    }
  ]
};

// Post-arrest reporting data
export const postArrestReportingData = {
  title: "Post-Arrest Reporting",
  description: "Complete the necessary documentation following the arrest of the suspect.",
  reportSections: [
    {
      id: "section1",
      title: "Arrest Details",
      fields: [
        {
          id: "arrestDate",
          label: "Date of Arrest",
          type: "date",
          required: true
        },
        {
          id: "arrestLocation",
          label: "Location of Arrest",
          type: "text",
          required: true
        },
        {
          id: "arrestingOfficers",
          label: "Arresting Officers",
          type: "text",
          required: true
        },
        {
          id: "cooperatingAgencies",
          label: "Cooperating Agencies",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "section2",
      title: "Suspect Information",
      fields: [
        {
          id: "suspectName",
          label: "Suspect Name",
          type: "text",
          required: true,
          value: "Rajesh Kumar"
        },
        {
          id: "suspectID",
          label: "Suspect ID Number",
          type: "text",
          required: true
        },
        {
          id: "suspectRole",
          label: "Role in Crime",
          type: "select",
          options: ["Primary Perpetrator", "Money Mule", "Accomplice", "Other"],
          required: true
        },
        {
          id: "priorOffenses",
          label: "Prior Offenses",
          type: "textarea",
          required: false
        }
      ]
    },
    {
      id: "section3",
      title: "Evidence Collected During Arrest",
      fields: [
        {
          id: "devicesSeized",
          label: "Devices Seized",
          type: "checkbox",
          options: ["Mobile Phone", "Laptop", "Desktop Computer", "External Storage", "SIM Cards", "Documents"],
          required: true
        },
        {
          id: "evidenceDescription",
          label: "Evidence Description",
          type: "textarea",
          required: true
        },
        {
          id: "chainOfCustody",
          label: "Chain of Custody Initiated",
          type: "radio",
          options: ["Yes", "No"],
          required: true
        }
      ]
    },
    {
      id: "section4",
      title: "Case Update",
      fields: [
        {
          id: "caseStatus",
          label: "Case Status",
          type: "select",
          options: ["Investigation Ongoing", "Ready for Prosecution", "Awaiting Additional Evidence", "Closed"],
          required: true
        },
        {
          id: "nextSteps",
          label: "Next Steps",
          type: "textarea",
          required: true
        },
        {
          id: "additionalSuspects",
          label: "Additional Suspects Identified",
          type: "radio",
          options: ["Yes", "No"],
          required: true
        },
        {
          id: "suspectCooperation",
          label: "Suspect Cooperation Level",
          type: "select",
          options: ["Full Cooperation", "Partial Cooperation", "No Cooperation"],
          required: true
        }
      ]
    }
  ]
};

// Legal procedure matching data
export const legalProcedureMatchingData = {
  title: "Legal Procedure Matching",
  description: "Match each legal procedure with its correct description to ensure proper case processing.",
  instructions: "Match each legal procedure on the left with its correct description on the right.",
  pairs: [
    {
      id: "pair1",
      left: "Transit Warrant",
      right: "Legal document allowing transfer of accused between jurisdictions"
    },
    {
      id: "pair2",
      left: "Remand Application",
      right: "Request to court for police custody of accused for investigation"
    },
    {
      id: "pair3",
      left: "Property Seizure Memo",
      right: "Document listing all items confiscated during arrest or search"
    },
    {
      id: "pair4",
      left: "Section 65B Certificate",
      right: "Authentication of electronic evidence for admissibility in court"
    },
    {
      id: "pair5",
      left: "Charge Sheet",
      right: "Final report submitted to court detailing accusations and evidence"
    },
    {
      id: "pair6",
      left: "Judicial Custody",
      right: "Detention of accused in jail under court authority"
    },
    {
      id: "pair7",
      left: "Bail Opposition",
      right: "Prosecutor's argument against releasing accused before trial"
    },
    {
      id: "pair8",
      left: "Case Diary",
      right: "Chronological record of investigation proceedings and findings"
    }
  ]
};

export default {
  interstateCoordinationData,
  suspectInterrogationData,
  postArrestReportingData,
  legalProcedureMatchingData
};