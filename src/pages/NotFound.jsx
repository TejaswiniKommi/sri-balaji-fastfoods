import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

export default function NotFound() {
  return (
    <Container className="py-12">
      <EmptyState icon="🧭" title="Page not found" message="The page you're looking for doesn't exist.">
        <Button to="/">Go to home</Button>
        <Button to="/menu" variant="outline">View menu</Button>
      </EmptyState>
    </Container>
  )
}
