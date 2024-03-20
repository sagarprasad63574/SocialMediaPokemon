import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';

const ConductFightSequence = ({ user_team_name, opponent_team_name, opponent_id, yourTeam, opponentTeam, battleResult }: any) => {

  const battleSummary = battleResult.summary.map((sum: any, index: any) => {
    return <ListGroup.Item key={index}>{sum}</ListGroup.Item>
  })

  const battleDetails = battleResult.details.map((sum: any, index: any) => {
    return <ListGroup key={index}>
      {sum.map((s: any, index: any) => <ListGroup.Item key={index}>{s}</ListGroup.Item>)}
    </ListGroup>
    
  })

  return (
    <div>
      <h1>BATTLE</h1>
      <h5>User Team Name: {user_team_name}</h5>
      <h5>Opponent Team Name: {opponent_team_name}</h5>
      <h5>Message: {battleResult.message}</h5>
      <h5>Summary:</h5>
      {battleResult.summary ? <ListGroup>{battleSummary}</ListGroup> : <h5>No summary</h5>}
      <h5>Details:</h5>
      {battleResult.details ? <ListGroup>
        {battleDetails}</ListGroup> : <h5>No details</h5>}

    </div>
  )
}

export default ConductFightSequence