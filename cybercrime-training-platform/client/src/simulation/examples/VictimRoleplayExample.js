/**
 * Victim Roleplay Example
 * 
 * This file provides an example implementation of a victim roleplay simulation
 * using the dialog system.
 */
import { DialogTree, DialogNode, DialogMessodels';
im


/**
 * Create a victim roleplay simulationle
 * @returns {Object} The sidata
 */
const createVictimRoleplayExampl
  // Create participants
  const victim = new DialogParticipant({
    id: 'victim',
    name: 'Rr',
    type: PARTICIPANT_TYPES.CACTER,
    aale.png',
,
    emotionalStateD,
    traitsed']
  });

  // Clog nodes
  const introNode = new DialogNoe({
    id: 'intro',
    message: n
      type: MESSAGE_TYPES.TEXT_WITH_IO,
      content: "H
      audioUrl: '/assets/audio/tro.mp3',
      participantId: 'victim',
      participantType: PARTICIPANT_TYPE
    }),
    participantId: 'victim',
    emotionalState
    options: [
      nion({
        id: 'intro-response-1',
        text: "I understand this is distressing. Can you te
        nextNodeId: 'details',
        mecs: {
          [: 2,
   ITY]: 1,
     ,
     1
        },
        feed
      }),
      new DialogOption({
        id: 'intro-response-2',
        text: "You shouldn't have shared yom.",
        nextNodeId: '
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: -1,
          [COMMUNICATION_METRICS.,
          [COMMUNICATION_
       
        },
        feedback: "."
      }),
      new DialogOption({
        id: 'intro-response-3',
        text: "Please fill out this fo",
        nextNodeId: 'form',
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: 0,
          [COMMUNICATION_METRICS.
          [COMMUNICATIONM]: 1,
          [COMMU
        },
        feedback: "athy."
      })
    ]
  });

  const detailsNode = nealogNode({
    id: 'details',
    message: new e({
      type: MESSAGE_TYPES.TEXT,
",
      ',
      
    }),
    participantId: 'victim',
    emED,
    options: [
      new DialogOption({
        id: 'details-response-1',
        text: "Thank you for sharing the you?",
        nextNod
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: 1,
          [COMMUNICATION_METRICS.CLARITY]: 2,
          [COMMUNICATION_ 2,
      ]: 1
        },
        feedbae."
      }),
      new DialogOption({
        id: 'details-response-2',
        text: "We need to act quickly. W,
        nextNodeId: 't',
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: 0,
          [COMMUNICATION_METRICS.CLARITY]: 1,
          [COMMUNICATION_METR
          [COMMUNICAT: 0
        },
        feedback: "This shows uy."
      }),
      new DialogOption({
        id: 'details-response',
        text: "I understand how upsetting this must be. Let me explain what we'll do to help recover your money and catch those responsible.",
        nextNodeId: 'explain',
        metrics: {
          [COMMUNI]: 2,
          [COMMUNICATION_METRICS.CLARITY]: 1,
LISM]: 1,
       : 2
       

      })
    ]
  });

  const transactionNode = new DialogNode({
    id: 'transaction',
    message: nege({
      type: MESSAGE_TYPE
      content: "Yes, I have all the details here. The transaction happened at 5:30 PM yesterday. 
      audioUrl: '/assets/audio/victim-trann.mp3',
      partim',
      particTER
    }),
    par',
    emotionalStateChange: EMOTIONAL_STATE
    options: [
      new DialogOption({
        id: 'transaction-response-1',
        text: "You',
        nextNodecrp',
        metrics: {
          [COMMUNICATION_METRICS.EMP 1,
          [COMMUNICA
          [COMMUNICA
          [COMMUNICATION_METRICS.PATIENCE]: 1
        },
        f."
      }),
      new DialogOption({
        id: 'transaction-response-2',
        text: "Do you
        nextNodeId: 'utr',
        metrics: {
          [COMMUY]: 0,
          [ARITY]: 1,
      1,
    
      
        feedback: "This is a good technical question but misses an opportunity to reasctim."
      }),
      new DialogOption({
        id: 'transaction-response-3',
        text: "Thank you for these details. I understan",
        nextNodeId: 'ncrp',
        metrics: {
          [COMMUNICATION_METRICS.EM
          [COMMUNICATION_METRICS.CLARITY]: 1,
          [COMMUNICATION_METRICS.PRO
          [COMMUNICATION_M
      
        feedback: "Excellent balance of empathy and professionalism while moving the process forward."
      })
    ]
  });

  const ncrpNode = new DialogNode({
    id: 'ncrp',
    message: new DialogMe({
      type: MESSAGE_TYPES.TEXT,
      content: "Thank you, officer. I'm rel",
      participictim',
      participantTyER
    }),
    participantId: 'victim',
    emM,
    options: [
      new DialogOption({
        id: 'ncrp-response-1',
        text: "NCRP stands for Nes.",
        nextNodeId: 'c
        metrics: {
          [COMMUNICATION_METRICS.EMPATY]: 1,
,
        ]: 2,
          [CE]: 1
        },
        feedback: "Honest and clear explanation that manages expectations appropriately."
      }),
      new DialogOption({
        id: 'ncrp-response-2',
        text: "It's our online reporting sys.",
        nextNodeId: 'conclusion',
        metrics: {
          [COMMUNICATION_METRI
          [COMMUNICATION_METRICS.CLARITY]: 0,
          [COMMUNICATION_METRICS.PRO
          [COMMUNICATION_METRI0
        },
        feedback: "This response is too simplistic and potentially cr
      }),
      new DialogOption({
        id: 'ncrp-response-3',
        text: "NCRP is our national cyblp.",
        nextNodeId: 'conclusion',
        metrics: {
          [COMMUNICATION_METR
          [COMMUNICATION_METRICS.CLARITY]: 2,
          [COMMUNICATION_ME 2,
          [COMMU 2
        },
        feedback: "Excellent detailed explanations."
      })
    ]
  });

  const conclusionNode = new DialogNode({
    id: 'conclusion',
    message: new DialogMessage({
     
      content: "I understand. Thank you for expl
      audioUrl: '/assets/audio/victim-concluion.mp3',

      parCTER
    }),
    participantId: 'victim',
    emotionalStatLM,
    isEndNode: true
  });

  // Create additional nodes for other pats
  const formNode = new DialogNode({
    id: 'form',
    message: new DialogMessage({
      type: MESSAGE_TYPES.TEXT
      content: "A form? But I need hel,
',
ACTER
    }),
    
    emotionalStateChange: EMOTIONAL_STATES.FRUSTRATED,
    options: [
      new DialogOption({
        id: 'form-response-1',
        text: "You're right, and I apologi",
        nextNodeId: 'details',
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: 2,
          [COMMUNICATION_METRICS.CLARITY]: 1,
          [COMMUNICATSM]: 1,
          [COMMUNICATION_METRE]: 2
        },
        feedback: "Good recovery that acknowledges the victim's needs."
      }),
      new DialogOption({
        id: 'form-response-2',
        text: "The form is how we help you. It's reqts.",
        nextNodeId: 'defensive',
  s: {
          [COMMUNICATION_METRICS.EMPA
          [COMMUNICATION_METRICS.CLARITY]: 0,
          [COMMUNICATION_METRICS.SM]: 0,
          [COMMUNICATION_MCE]: -1
   ,
        feedback: "This response is technically correct but lacks empathy and doesn't address the vi."
   })
    ]
  });

  const defensiveNode = new DialogNode({
    id: 'defensive'
    message: new DialogMessage({
      type: MESSAGE_TYPES.TEXT,
      content: "I know that now! 
      participantId: 'victim',
      participantER
    }),
    participantId: 'victim,
    emNGRY,
    options: [
      new DialogOption({
        id: 'defensive-response-1',
        text: "I apologize, I didn't,
        nextNodeId: 'details',
        metrics:
          [COMMUNICATION_METRICS.EMPATHY]: 2,
,
      ]: 2,
      : 2
        },
        feedback: "Excellent recovery - acknowledging the mistake and refocusing on helping."
      }),
      new DialogOption({
        id: 'defensive-response-2',
        text: "Please calm down. I need you to answe.",
        nextNodeId: 'more-defensive',
        metric {
          [COMMUNICATION_METRICS,
          [COMMUNICATION_METRICS.CLARITY]: 0,
          [COMMUNICATION_METM]: -1,
          [COMMUNICATION_METR
        },
        feedback: "Telling someone to 'calm down' often escalates the situation. This resthy."
      }),
      new DialogOption({
        id: 'defensive-response-3',
        text: "Let's start over. Can you tellmmers?",
        nextNodeId: 'details',
      : {
          [COMMUNICATION_METRIC 1,
          [COMMUNICATION_METRICS.CLARITY]: 1,
          [COMMUNICATION_METRICS.PROFESSIONALIS1,
          [COMMU1
        },
        feedback: "Good redirection to focus on gathering information w."
      })
    ]
  });

  const moreDefensiveNode = new DialogNode({
    id: 'mor',
    message: new DialogMessage({
      type: MESSAGE_TYPES.TEXT,
      content: "I am calm! This is ridiculoation.",
      participantId: 'victim',
      
    }),
    participantId: 'victim',
    e
    options: [
      new DialogOption({
        id: 'more-defensive-response-1',
        text: "Sir, I sincerely apologize for my approach. You're absolutely right to be upset about both the crime and my handling of it. I want to help you recover your money. Could we start again?",
        nextNodeId: 'details',
        metrics: {
          [CTHY]: 2,
          [COMMUNICATION_METRICS.CLARITY]: 1,
 
      2

        felings."
      }),
   
        id: 'more-defensive-response-2',
        text: "That's your right, but it will delay the process of s.",
        nextNodeId: 'reluctant',
        metrics: {
          [CO-1,
          [COMMUNICATION_METRICS.1,
          [COMMUNICATION_METRICS.PROFESSIONALISM]: 0,
          [COMMUNICATION_METRICS.PATIENCE]: -1
        },
        feed
      }),
      new DialogO
        id: 'more-defensive-response-3',
        text: "Let me get my supervisor to help you instead.",
        nextNodeId: 'supervisor',
        metrics: {
          [COMMUNICA0,
          [COMMUNICATION_METRI 0,
          [COMMUNICATION_METRICS.PROFESSIONALISM]: 0,
          [COMMUNICATION_METRICSCE]: -1
        },
   ility."
      })
    ]
  });

  const explainNode = new DialogNode({
    id: 'explain',
    message: new
      type: MESSAGE_TYPES.TEXT,
      content: "Thank you. I really need to know there's hope of getting my money back. It's a large amount for me.",
      participantId: 'victim',
      paR
    }),
    participantId: 'victim',
    emotionalStateChaFUL,
    opt[
      new DialogOption({
        id: 'explain-respon
        text: "I understand. First, we'll file an NCRP complaint which alerts banks and cybercrime units. The sooner we do this, the better the chances. Could you share the transaction d,
        nextNodeId: 'trans
        metrics: {
          [COMMUNICATION_METRICS1,
          [COMMUNICATION_METRICS.CLARITY]: 2,
,
    
      },
        feedb."
      }),
   
        id: 'explain-response-2',
        text: "We'll try our best, but I can't make any pro
        nextNodeId: 'defensive',
        metrics: {
          ,
          [COMMUNICATION_METRICS.CLA
          [COMMUNICATION_METRICS.PROFESSIONALISM]: 0,
          [COMMUNICATION_METRICS]: 0
        },
      e."
      })
    ]
  });

  const utrNode = new DialogNode({
    id: 'utr',
    message: new D({
      type: MESSAGE_TYPES.TEXT,
      content: "Yes, I have the UTR number from my bank statement. It's UTR123456789. Will this help get my money",
      participantim',
      participantType: 
    }),
    participantId: 'victim',
    emotioUL,
    options: [
      new DialogOption({
        id: 'utr-response-1',
        text: "This is extremely helpful. The UTR number 
        nextNodep',
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: 1,
          [COMMUNICATION_METRICS.CLARITY]: 2,
          [COMMUN
          [COMMUNICATI
        },
        feedback: "Good explanation t
      }),
      new DialogOption({
        id: 'utr-response-2',
        text: "Perfect. Let me note that down. Now let's complete the rest of your complaint details.",
        nextNodeId: 'ncrp',
        metrics: {
          [COMMUNICATION_M]: 0,
          [COMMUNICATION_METRICS1,
,
          [COMCE]: 0
        },
      
      })
   ]
  });

  const supervisorNode = new Dialo{
    id: 'supervisor',
    message: new ({
      type: MESSAGE_TYPES.T
      content: "Fine. I'll wait for your supervisor. But please understand that I'm upset about losing my money, not about coming to the police station.",
      participantId: 'victim
      participantType: PARCTER
    
    participantId: 'victim',
    emotionalSTRATED,
    options: [
      new DialogOption({
        id: 'supervisor-response-1',
        text: "I completely understand, and you ha",
        nex,
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: 2,
          [COMMUNICATION_METRICS.CLAR 1,
         
          [COMMUNIENCE]: 2
        },
        feedback: "Exce"
      }),
      new DialogOption({
        id: 'supervisor-response-2',
        text: "My supervisor will be with you",
        nextNo
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: -1,
          [COMMUNICATION_METRICS.C
          [COMMUNICAT]: 0,
          [COMMUNICATIO -1
        },
        feedback: "This respons
      })
    ]
  });

  const reluctantNode = new DialogNode({
    id: 'reluctant',
    message: new Dial{
      type: MESSAGE_TYPES.TEXT,
     ",
     im',
    R
    }),
    participantId: 'victim',
    emotionalS
    options: [
      new DialogOption({
        id: 'reluctant-response-1',
        text: "You're absolutely am?",
        nextNodeId: 'detai',
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: 2,
          [COMMUNICATION_METRICS.CLAR: 1,
          [COMMUNI,
 ]: 2
        },
        feedback
      }),
      new DialogOption({
        id: 'reluctant-response-2',
        text: "Let's just stick to the facts of your case .",
        nextNls',
        metrics: {
          [COMMUNICATION_METRICS.EMPATHY]: -1,
          [COMMUNICATION_METRICS.,
          [COMMUNICM]: 0,
     : -1
        },
        feedback: "T."
      })
    ]
  });

  // Create the dialog t
  const dialogTree = new Dee({
    title: 'Banking Fraud Victim Interview',
    description: 'Practice intervud',
    nodes: {
      'intrroNode,
      'details': detailsNode,
      'defensive': defensiveNode,
      '
      'transaction': transactionNode,
      'ncrp': ncrpNode,
      'conclusion': conclusionNode,
      'form': formNode,
      'explain': explainNode,
      'utr': utrNode,
     
      'reluctant': reluctantNode
    },
ts: {
      'victim
    },
    rootNodeId: 'intro'
  });

  // Return the simulation data
  return {
    title: 'Banking',
    description: 'Practice interviewing a victim of o.',
    dialog
    metadata: {
      diffe',
      category: 'financial-fraud',
      estimatedTime: '10-15 minutes'
    }
;
};

export default createVictimRoleplayExample;