const { performance } = require('perf_hooks');

// Simple performance test for the GraphQL API
async function testPerformance() {
  const GRAPHQL_URL = 'http://localhost:3001/api/graphql';
  const CONCURRENT_REQUESTS = 10;
  const TOTAL_REQUESTS = 50;

  console.log('🚀 Starting performance test...');
  console.log(`Testing ${TOTAL_REQUESTS} requests with ${CONCURRENT_REQUESTS} concurrent requests`);
  
  const queries = [
    {
      name: 'getAllEmployees',
      query: `
        query {
          getAllEmployees {
            id
            name
            position
            department
            salary
          }
        }
      `
    },
    {
      name: 'getEmployeesByDepartment',
      query: `
        query {
          getEmployeesByDepartment(department: "Engineering") {
            id
            name
            position
            salary
          }
        }
      `
    },
    {
      name: 'getDepartments',
      query: `
        query {
          getDepartments
        }
      `
    }
  ];

  async function makeRequest(query) {
    const start = performance.now();
    
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.query
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const duration = performance.now() - start;
      
      return {
        name: query.name,
        duration,
        success: !data.errors,
        errors: data.errors
      };
    } catch (error) {
      const duration = performance.now() - start;
      return {
        name: query.name,
        duration,
        success: false,
        error: error.message
      };
    }
  }

  // Test cache performance by running the same query multiple times
  async function testCaching() {
    console.log('\n📦 Testing cache performance...');
    const query = queries[0]; // getAllEmployees
    const results = [];

    for (let i = 0; i < 5; i++) {
      const result = await makeRequest(query);
      results.push(result);
      console.log(`Request ${i + 1}: ${result.duration.toFixed(2)}ms`);
    }

    const firstRequest = results[0].duration;
    const avgCachedRequests = results.slice(1).reduce((sum, r) => sum + r.duration, 0) / 4;
    
    console.log(`First request (uncached): ${firstRequest.toFixed(2)}ms`);
    console.log(`Average cached requests: ${avgCachedRequests.toFixed(2)}ms`);
    console.log(`Cache speedup: ${(firstRequest / avgCachedRequests).toFixed(2)}x faster`);
  }

  // Test concurrent requests
  async function testConcurrentRequests() {
    console.log('\n⚡ Testing concurrent requests...');
    const promises = [];
    
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      const query = queries[i % queries.length];
      promises.push(makeRequest(query));
    }

    const start = performance.now();
    const results = await Promise.all(promises);
    const totalTime = performance.now() - start;

    const successfulRequests = results.filter(r => r.success);
    const failedRequests = results.filter(r => !r.success);
    
    console.log(`Total time for ${CONCURRENT_REQUESTS} concurrent requests: ${totalTime.toFixed(2)}ms`);
    console.log(`Successful requests: ${successfulRequests.length}`);
    console.log(`Failed requests: ${failedRequests.length}`);
    
    if (successfulRequests.length > 0) {
      const avgDuration = successfulRequests.reduce((sum, r) => sum + r.duration, 0) / successfulRequests.length;
      console.log(`Average request duration: ${avgDuration.toFixed(2)}ms`);
    }
  }

  // Test overall performance
  async function testOverallPerformance() {
    console.log('\n🏁 Testing overall performance...');
    const results = [];
    
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
      const query = queries[i % queries.length];
      const result = await makeRequest(query);
      results.push(result);
      
      if ((i + 1) % 10 === 0) {
        console.log(`Completed ${i + 1}/${TOTAL_REQUESTS} requests`);
      }
    }

    const successfulRequests = results.filter(r => r.success);
    const failedRequests = results.filter(r => !r.success);
    
    if (successfulRequests.length > 0) {
      const durations = successfulRequests.map(r => r.duration);
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      
      console.log('\n📊 Performance Summary:');
      console.log(`Total requests: ${TOTAL_REQUESTS}`);
      console.log(`Successful: ${successfulRequests.length}`);
      console.log(`Failed: ${failedRequests.length}`);
      console.log(`Average response time: ${avgDuration.toFixed(2)}ms`);
      console.log(`Fastest response: ${minDuration.toFixed(2)}ms`);
      console.log(`Slowest response: ${maxDuration.toFixed(2)}ms`);
      console.log(`Requests per second: ${(1000 / avgDuration).toFixed(2)}`);
    }
  }

  // Run all tests
  try {
    await testCaching();
    await testConcurrentRequests();
    await testOverallPerformance();
    console.log('\n✅ Performance test completed!');
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  }
}

// Run the test
testPerformance().catch(console.error);
