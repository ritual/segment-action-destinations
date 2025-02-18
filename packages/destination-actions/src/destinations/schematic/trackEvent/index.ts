import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'

function snakeCase(str: string) {
  const result = str.replace(/([A-Z])/g, '$1')
  return result.split(' ').join('_').toLowerCase()
}

const action: ActionDefinition<Settings, Payload> = {
  title: 'Track Event',
  description: 'Send track events to Schematic',
  defaultSubscription: 'type = "track"',
  fields: {
    event_name: {
      label: 'Event name',
      description: 'Name of event (this will be snake cased in request)',
      type: 'string',
      required: true,
      default: { '@path': '$.event' }
    },
    company_keys: {
      label: 'Company keys',
      description: 'Key-value pairs associated with a company (e.g. organization_id: 123456)',
      type: 'object',
      defaultObjectUI: 'keyvalue',
      additionalProperties: true,
      required: false
    },
    user_keys: {
      label: 'User keys',
      description: 'Key-value pairs associated with a user (e.g. email: example@example.com)',
      type: 'object',
      required: false,
      defaultObjectUI: 'keyvalue',
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
    traits: {
      label: 'Traits',
      description: 'Additional properties to send with event',
      type: 'object',
      defaultObjectUI: 'keyvalue',
      required: false,
      additionalProperties: true,
      properties: {
        raw_event_name: {
          label: 'Raw Event Name',
          description: 'Event name',
          type: 'string',
          required: false
        }
      },
      default: {
        raw_event_name: { '@path': '$.event' }
      }
    }
  },

  perform: (request, { settings, payload }) => {
    return request('https://api.schematichq.com/events', {
      method: 'post',
      headers: { 'X-Schematic-Api-Key': `${settings.apiKey}` },
      json: {
        body: {
          company: payload.company_keys,
          user: payload.user_keys,
          traits: payload.traits,
          event: snakeCase(payload.event_name)
        },
        event_type: 'track'
      }
    })
  }
}

export default action
