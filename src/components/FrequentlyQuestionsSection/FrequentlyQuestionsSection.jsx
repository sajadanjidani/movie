import FrequentlyQuestion from './element/FrequentlyQuestion/FrequentlyQuestion'
import { useState } from 'react'

export default function FrequentlyQuestionsSection() {

    const [questions , setQuestions] = useState([
        {id : 1 , questionTitle : 'What is this website ?' , questionAnswer : 'This website is a personal practice project created to showcase my Front-End development skills. It has no commercial value or purpose.' , isOpen : false},
        {id : 2 , questionTitle : 'What technologies were used to build this website ?' , questionAnswer : 'This project was built using modern web technologies, including React, Tailwind CSS, and other related libraries. The goal was to practice building a real-world, responsive web application.' , isOpen : false},
        {id : 3 , questionTitle : 'Is the information and content on this website official ?' , questionAnswer : 'No. The information, images, and content used on this website are provided for demonstration and practice purposes only and should not be considered official or authoritative.' , isOpen : false},
        {id : 4 , questionTitle : 'Does this website have any commercial purpose ?' , questionAnswer : 'No. This project was created solely for learning, practice, and portfolio purposes. It does not sell products or services and generates no revenue.' , isOpen : false},
    ])

    const modeStatusHandler = (id) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === id
                    ? { ...question, isOpen: !question.isOpen }
                    : { ...question, isOpen: false }
            )
        )
    }
  return (
    <div className="py-32">
        <h2 className="text-center text-4xl font-bold">The this website Questions Everyone's Asking</h2>
        <ul className='grid justify-center gap-9 mt-24'>
            {questions.map(question => (
                <FrequentlyQuestion key={question.id} {...question} clickHandler={modeStatusHandler}/>
            ))}
        </ul>
    </div>
  )
}
