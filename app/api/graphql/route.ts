import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { typeDefs } from "@/lib/graphql/schema"
import { resolvers } from "@/lib/graphql/resolvers"
import { connectToMongoDB } from "@/lib/mongodb"
import { PerformanceMonitor } from "@/lib/performance"

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [
    {
      async requestDidStart() {
        return {
          async didResolveOperation(requestContext: any) {
            const monitor = PerformanceMonitor.getInstance()
            monitor.incrementRequestCount('graphql_request')
          },
          async didEncounterErrors(requestContext: any) {
            console.error('GraphQL errors:', requestContext.errors)
          },
        }
      },
    },
  ],
  formatError: (error) => {
    // Log errors but don't expose internal details in production
    console.error('GraphQL error:', error)
    
    if (process.env.NODE_ENV === 'production') {
      return new Error('Internal server error')
    }
    return error
  },
})

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    const startTime = performance.now()
    
    try {
      await connectToMongoDB()
      const connectionTime = performance.now() - startTime
      
      if (connectionTime > 100) {
        console.warn(`⚠️ Slow MongoDB connection: ${connectionTime.toFixed(2)}ms`)
      }
      
      return { connectionTime }
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      throw error
    }
  },
})

export { handler as GET, handler as POST }
