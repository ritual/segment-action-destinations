import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Identify User',
  description: 'Send identify events to Schematic',
  defaultSubscription: 'type = "identify"',
  fields: {
    company_keys: {
      label: 'Company key name',
      description: 'Key-value pairs associated with a company (e.g. organization_id: 123456)',
      type: 'object',
      required: false,
      defaultObjectUI: 'keyvalue',
      additionalProperties: true
    },
    company_name: {
      label: 'Company name',
      description: 'Name of company',
      type: 'string',
      required: false,
      default: { '@path': '$.traits.company_name' }
    },
    company_traits: {
      label: 'Company traits',
      description: 'Properties associated with company',
      type: 'object',
      defaultObjectUI: 'keyvalue',
      required: false
    },
    user_keys: {
      label: 'User keys',
      description: 'Key-value pairs associated with a user (e.g. email: example@example.com)',
      type: 'object',
      defaultObjectUI: 'keyvalue',
      required: true,
      additionalProperties: true,
      properties: {
        user_id: {
          label: 'User ID',
          description: 'Your unique ID for your user',
          type: 'string',
          required: false
        }
      },
      default: {
        user_id: { '@path': '$.userId' }
      }
    },
    user_name: {
      label: 'User name',
      description: "User's full name",
      type: 'string',
      required: false,
      default: { '@path': '$.traits.name' }
    },
    user_traits: {
      label: 'User traits',
      description: 'Properties associated with user',
      type: 'object',
      defaultObjectUI: 'keyvalue',
      required: false
    }
  },

  perform: (request, { settings, payload }) => {
    return request('https://api.schematichq.com/events', {
      method: 'post',
      headers: { 'X-Schematic-Api-Key': `${settings.apiKey}` },
      json: {
        body: {
          company: {
            keys: payload.company_keys,
            name: payload.company_name,
            traits: payload.company_traits
          },
          keys: payload.user_keys,
          name: payload.user_name,
          traits: payload.user_traits
        },
        event_type: 'identify'
      }
    })
  }
}

export default action
