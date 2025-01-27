import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'
import LevelCalculator from './levelCalculator'

export default function UserCard(user) {
    return (
        <Container className="mt-2 mb-2 w-100" key={user.id}>
            <Card>
                <Card.Body>
                    <Card.Title>
                        {user.name} {user.admin ? "(Admin)" : ""}
                    </Card.Title>
                    <Card.Subtitle>
                        Level {LevelCalculator(user).currentLevel}
                    </Card.Subtitle>
                    <Card.Text>
                        Has earned X badges.
                    </Card.Text>
                    <ProgressBar now={LevelCalculator(user).currentLevelPercentage} variant="success">
                    </ProgressBar>
                    {window.location.pathname == "/admin" &&
                        <Container fluid className="mt-2 mb-2">
                            <Button variant="primary" onClick={(e) => changeShowModal(e, user)}>
                                Details
                            </Button>
                        </Container>
                    }
                </Card.Body>
            </Card>
        </Container>
    )
}