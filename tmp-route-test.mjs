const baseUrl = 'http://127.0.0.1:3000'

async function callApi(method, path, body) {
  const options = { method, headers: {} }

  if (body !== undefined) {
    options.headers['content-type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const response = await fetch(baseUrl + path, options)
  const text = await response.text()

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = text
  }

  return {
    method,
    path,
    status: response.status,
    body: parsed,
  }
}

function printResult(result) {
  console.log('---')
  console.log(`${result.method} ${result.path}`)
  console.log(`status: ${result.status}`)
  console.log('body:', JSON.stringify(result.body))
}

async function main() {
  const email = `ana.${Date.now()}@example.com`

  const results = []

  const createUser = await callApi('POST', '/api/users', {
    first_name: 'Ana',
    last_name: 'Silva',
    email,
    password: '123456',
  })
  results.push(createUser)

  const userId = createUser.body?.id

  results.push(await callApi('GET', `/api/users/${userId}`))
  results.push(
    await callApi('PATCH', `/api/users/${userId}`, {
      last_name: 'Silva Atualizada',
    }),
  )
  results.push(await callApi('GET', `/api/users/${userId}/balance`))

  const createTransaction = await callApi('POST', '/api/transactions', {
    user_id: userId,
    name: 'Salario',
    date: '2026-08-30T00:00:00.000Z',
    amount: 1000.5,
    type: 'EARNING',
  })
  results.push(createTransaction)

  const transactionId = createTransaction.body?.id

  results.push(await callApi('GET', `/api/users/${userId}/transactions`))
  results.push(
    await callApi('PATCH', `/api/transactions/${transactionId}`, {
      name: 'Salario Agosto',
      amount: 900.25,
      type: 'EARNING',
    }),
  )
  results.push(await callApi('DELETE', `/api/transactions/${transactionId}`))
  results.push(await callApi('DELETE', `/api/users/${userId}`))

  for (const result of results) {
    printResult(result)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
