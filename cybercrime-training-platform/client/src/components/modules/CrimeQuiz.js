import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

/**
 * Crime or Not a Crime Quiz Component
 * 
 * A drag-and-drop quiz that tests users' ability to identify cybercrime scenarios
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Quiz items to categorize
 * @param {Function} props.onComplete - Callback when quiz is completed
 * @param {Function} props.onProgress - Callback for progress updates
 */
const CrimeQuiz = ({ 
  items = [], 
  onComplete, 
  onProgress 
}) => {
  // State for quiz items and their placement
  const [quizItems, setQuizItems] = useState([]);
  const [crimeItems, setCrimeItems] = useState([]);
  const [notCrimeItems, setNotCrimeItems] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  // Initialize quiz items
  useEffect(() => {
    if (items.length > 0) {
      // Shuffle items for randomization
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);
      setQuizItems(shuffledItems);
    }
  }, [items]);

  // Default quiz items if none provided
  const defaultItems = [
    {
      id: 'item_1',
      text: 'Sending threatening messages on social media',
      category: 'crime',
      explanation: 'This constitutes cyberbullying and harassment, which is a cybercrime under IT Act.'
    },
    {
      id: 'item_2', 
      text: 'Downloading music from official streaming services',
      category: 'not_crime',
      explanation: 'Using legitimate streaming services with proper subscription is legal.'
    },
    {
      id: 'item_3',
      text: 'Creating fake social media profiles to deceive people',
      category: 'crime',
      explanation: 'Identity theft and impersonation are serious cybercrimes.'
    },
    {
      id: 'item_4',
      text: 'Sharing your own photos on social media',
      category: 'not_crime',
      explanation: 'Sharing your own content on social media is perfectly legal.'
    },
    {
      id: 'item_5',
      text: 'Hacking into someone else&apos;s email account',
      category: 'crime',
      explanation: 'Unauthorized access to computer systems is a serious offense under IT Act.'
    },
    {
      id: 'item_6',
      text: 'Using public WiFi to browse the internet',
      category: 'not_crime',
      explanation: 'Using public WiFi for legitimate purposes is legal.'
    },
    {
      id: 'item_7',
      text: 'Spreading false information to cause panic',
      category: 'crime',
      explanation: 'Spreading misinformation that causes public disorder is a cybercrime.'
    },
    {
      id: 'item_8',
      text: 'Online shopping from legitimate websites',
      category: 'not_crime',
      explanation: 'Shopping from legitimate e-commerce sites is a normal legal activity.'
    }
  ];

  // Use default items if none provided
  const activeItems = quizItems.length > 0 ? quizItems : defaultItems;

  // Handle drag end
  const handleDragEnd = (result) => {
    console.log('Drag ended:', result);
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      console.log('Dropped outside droppable area');
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the dragged item
    const draggedItem = activeItems.find(item => item.id === draggableId);
    if (!draggedItem) return;

    // Remove item from source
    if (source.droppableId === 'items') {
      // Remove from quiz items (this shouldn't happen in our design)
    } else if (source.droppableId === 'crime') {
      setCrimeItems(prev => prev.filter(item => item.id !== draggableId));
    } else if (source.droppableId === 'not_crime') {
      setNotCrimeItems(prev => prev.filter(item => item.id !== draggableId));
    }

    // Add item to destination
    if (destination.droppableId === 'crime') {
      setCrimeItems(prev => {
        const newItems = [...prev];
        newItems.splice(destination.index, 0, draggedItem);
        return newItems;
      });
    } else if (destination.droppableId === 'not_crime') {
      setNotCrimeItems(prev => {
        const newItems = [...prev];
        newItems.splice(destination.index, 0, draggedItem);
        return newItems;
    });
    }

    // Update progress
    const totalPlaced = crimeItems.length + notCrimeItems.length + 
      (destination.droppableId === 'crime' || destination.droppableId === 'not_crime' ? 1 : 0) -
      (source.droppableId === 'crime' || source.droppableId === 'not_crime' ? 1 : 0);
    
    if (onProgress) {
      onProgress({
        completed: totalPlaced,
        total: activeItems.length,
        percentage: Math.round((totalPlaced / activeItems.length) * 100)
      });
    }
  };

  // Get items that haven't been placed yet
  const getUnplacedItems = () => {
    const placedIds = [...crimeItems, ...notCrimeItems].map(item => item.id);
    return activeItems.filter(item => !placedIds.includes(item.id));
  };

  // Submit quiz for scoring
  const handleSubmit = () => {
    const results = [];
    let correctCount = 0;

    // Check crime items
    crimeItems.forEach(item => {
      const isCorrect = item.category === 'crime';
      if (isCorrect) correctCount++;
      results.push({
        item,
        userAnswer: 'crime',
        correctAnswer: item.category,
        isCorrect,
        explanation: item.explanation
      });
    });

    // Check not crime items
    notCrimeItems.forEach(item => {
      const isCorrect = item.category === 'not_crime';
      if (isCorrect) correctCount++;
      results.push({
        item,
        userAnswer: 'not_crime',
        correctAnswer: item.category,
        isCorrect,
        explanation: item.explanation
      });
    });

    const finalScore = Math.round((correctCount / activeItems.length) * 100);
    
    setScore(finalScore);
    setFeedback(results);
    setShowResults(true);
    setIsCompleted(true);

    if (onComplete) {
      onComplete({
        score: finalScore,
        correctCount,
        totalCount: activeItems.length,
        results
      });
    }
  };

  // Reset quiz
  const handleReset = () => {
    setCrimeItems([]);
    setNotCrimeItems([]);
    setIsCompleted(false);
    setShowResults(false);
    setScore(0);
    setFeedback([]);
  };

  const unplacedItems = getUnplacedItems();
  const allItemsPlaced = unplacedItems.length === 0;

  return (
    <div className="crime-quiz max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Crime or Not a Crime?
        </h2>
        <p className="text-gray-600">
          Drag each scenario to the correct category. Test your knowledge of what constitutes a cybercrime!
        </p>
      </div>

      {!showResults ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Unplaced Items */}
            <div className="lg:col-span-1">
              <Card header={<h3 className="font-semibold">Scenarios to Categorize</h3>}>
                <Droppable droppableId="items">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-32 p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300'
                      }`}
                    >
                      {unplacedItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 mb-2 bg-white border rounded-lg shadow-sm cursor-move transition-all ${
                                snapshot.isDragging 
                                  ? 'shadow-lg rotate-2 scale-105' 
                                  : 'hover:shadow-md'
                              }`}
                            >
                              <p className="text-sm text-gray-700">{item.text}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {unplacedItems.length === 0 && (
                        <p className="text-gray-400 text-center py-4">
                          All scenarios have been categorized!
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>

            {/* Crime Category */}
            <div className="lg:col-span-1">
              <Card header={
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold">Crime ({crimeItems.length})</h3>
                </div>
              }>
                <Droppable droppableId="crime">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-32 p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-red-300'
                      }`}
                    >
                      {crimeItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 mb-2 bg-red-50 border border-red-200 rounded-lg cursor-move transition-all ${
                                snapshot.isDragging 
                                  ? 'shadow-lg rotate-2 scale-105' 
                                  : 'hover:shadow-md'
                              }`}
                            >
                              <p className="text-sm text-gray-700">{item.text}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {crimeItems.length === 0 && (
                        <p className="text-gray-400 text-center py-4">
                          Drop cybercrime scenarios here
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>

            {/* Not Crime Category */}
            <div className="lg:col-span-1">
              <Card header={
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <h3 className="font-semibold">Not a Crime ({notCrimeItems.length})</h3>
                </div>
              }>
                <Droppable droppableId="not_crime">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-32 p-2 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-green-300'
                      }`}
                    >
                      {notCrimeItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 mb-2 bg-green-50 border border-green-200 rounded-lg cursor-move transition-all ${
                                snapshot.isDragging 
                                  ? 'shadow-lg rotate-2 scale-105' 
                                  : 'hover:shadow-md'
                              }`}
                            >
                              <p className="text-sm text-gray-700">{item.text}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {notCrimeItems.length === 0 && (
                        <p className="text-gray-400 text-center py-4">
                          Drop legal activities here
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={crimeItems.length === 0 && notCrimeItems.length === 0}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!allItemsPlaced}
            >
              Submit Quiz
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((crimeItems.length + notCrimeItems.length) / activeItems.length) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {crimeItems.length + notCrimeItems.length} of {activeItems.length} scenarios categorized
            </p>
          </div>
        </DragDropContext>
      ) : (
        /* Results Display */
        <div className="results">
          <Card header={
            <div className="text-center">
              <h3 className="text-xl font-bold">Quiz Results</h3>
              <div className={`text-3xl font-bold mt-2 ${
                score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}%
              </div>
              <p className="text-gray-600">
                {feedback.filter(f => f.isCorrect).length} out of {feedback.length} correct
              </p>
            </div>
          }>
            <div className="space-y-4">
              {feedback.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.isCorrect 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                      result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {result.isCorrect ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">
                        {result.item.text}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Your answer: <span className="font-medium">{result.userAnswer === 'crime' ? 'Crime' : 'Not a Crime'}</span>
                        {!result.isCorrect && (
                          <span className="ml-2">
                            | Correct answer: <span className="font-medium">{result.correctAnswer === 'crime' ? 'Crime' : 'Not a Crime'}</span>
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-700">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="primary"
                onClick={handleReset}
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CrimeQuiz;