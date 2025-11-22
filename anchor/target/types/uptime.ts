/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/uptime.json`.
 */
export type Uptime = {
  "address": "GxyaovA42Wp68kSdn7YCkGDXcpXzGVvGUfqb1V99LWER",
  "metadata": {
    "name": "uptime",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createMonitor",
      "discriminator": [
        134,
        50,
        61,
        171,
        37,
        142,
        250,
        197
      ],
      "accounts": [
        {
          "name": "monitor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "u64"
        },
        {
          "name": "interval",
          "type": "i64"
        },
        {
          "name": "label",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "createdAt",
          "type": "i64"
        }
      ]
    },
    {
      "name": "deleteMonitor",
      "discriminator": [
        146,
        214,
        85,
        58,
        255,
        181,
        65,
        112
      ],
      "accounts": [
        {
          "name": "monitor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "monitor.owner",
                "account": "monitor"
              },
              {
                "kind": "account",
                "path": "monitor.seed",
                "account": "monitor"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "monitor"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "mintAchievementNft",
      "discriminator": [
        215,
        35,
        8,
        179,
        20,
        237,
        118,
        82
      ],
      "accounts": [
        {
          "name": "monitor",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "monitor.owner",
                "account": "monitor"
              },
              {
                "kind": "account",
                "path": "monitor.seed",
                "account": "monitor"
              }
            ]
          }
        },
        {
          "name": "achievement",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "achievementType",
          "type": {
            "defined": {
              "name": "achievementType"
            }
          }
        },
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "recordPing",
      "discriminator": [
        130,
        205,
        181,
        36,
        51,
        68,
        55,
        0
      ],
      "accounts": [
        {
          "name": "monitor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "monitor.owner",
                "account": "monitor"
              },
              {
                "kind": "account",
                "path": "monitor.seed",
                "account": "monitor"
              }
            ]
          }
        },
        {
          "name": "reporter",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "success",
          "type": "bool"
        },
        {
          "name": "timestamp",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateMonitor",
      "discriminator": [
        13,
        77,
        143,
        194,
        155,
        159,
        165,
        19
      ],
      "accounts": [
        {
          "name": "monitor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "monitor.owner",
                "account": "monitor"
              },
              {
                "kind": "account",
                "path": "monitor.seed",
                "account": "monitor"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "monitor"
          ]
        }
      ],
      "args": [
        {
          "name": "newLabel",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newUrl",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "newInterval",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "withdrawFees",
      "discriminator": [
        198,
        212,
        171,
        109,
        144,
        215,
        174,
        89
      ],
      "accounts": [
        {
          "name": "monitor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  111,
                  110,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "monitor.owner",
                "account": "monitor"
              },
              {
                "kind": "account",
                "path": "monitor.seed",
                "account": "monitor"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "monitor"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "achievement",
      "discriminator": [
        30,
        253,
        162,
        142,
        30,
        160,
        66,
        62
      ]
    },
    {
      "name": "monitor",
      "discriminator": [
        197,
        187,
        52,
        136,
        133,
        153,
        154,
        100
      ]
    }
  ],
  "events": [
    {
      "name": "achievementMinted",
      "discriminator": [
        14,
        166,
        49,
        61,
        103,
        113,
        17,
        178
      ]
    },
    {
      "name": "feesWithdrawn",
      "discriminator": [
        234,
        15,
        0,
        119,
        148,
        241,
        40,
        21
      ]
    },
    {
      "name": "monitorCreated",
      "discriminator": [
        116,
        249,
        211,
        123,
        97,
        227,
        190,
        76
      ]
    },
    {
      "name": "monitorUpdated",
      "discriminator": [
        41,
        165,
        147,
        215,
        158,
        118,
        167,
        71
      ]
    },
    {
      "name": "pingRecorded",
      "discriminator": [
        25,
        124,
        63,
        162,
        150,
        145,
        203,
        177
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "labelTooLong",
      "msg": "The provided label exceeds the maximum length of 64 characters."
    },
    {
      "code": 6001,
      "name": "urlTooLong",
      "msg": "The provided URL exceeds the maximum length of 256 characters."
    },
    {
      "code": 6002,
      "name": "overflow",
      "msg": "An arithmetic overflow occurred."
    },
    {
      "code": 6003,
      "name": "noAvailableFunds",
      "msg": "No available funds to withdraw after reserving rent-exempt balance."
    },
    {
      "code": 6004,
      "name": "achievementNotEligible",
      "msg": "Monitor does not meet the requirements for this achievement."
    }
  ],
  "types": [
    {
      "name": "achievement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "monitor",
            "type": "pubkey"
          },
          {
            "name": "achievementType",
            "type": {
              "defined": {
                "name": "achievementType"
              }
            }
          },
          {
            "name": "mintedAt",
            "type": "i64"
          },
          {
            "name": "uptimeAtMint",
            "type": "f64"
          },
          {
            "name": "totalChecksAtMint",
            "type": "u64"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "achievementMinted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "monitor",
            "type": "pubkey"
          },
          {
            "name": "achievementType",
            "type": {
              "defined": {
                "name": "achievementType"
              }
            }
          },
          {
            "name": "uptime",
            "type": "f64"
          },
          {
            "name": "mintedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "achievementType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "uptime99For30Days"
          },
          {
            "name": "uptime999For30Days"
          },
          {
            "name": "uptime9999For90Days"
          },
          {
            "name": "uptime100For7Days"
          },
          {
            "name": "firstMonitor"
          },
          {
            "name": "hundredChecks"
          },
          {
            "name": "thousandChecks"
          }
        ]
      }
    },
    {
      "name": "feesWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "monitor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "interval",
            "type": "i64"
          },
          {
            "name": "lastPing",
            "type": "i64"
          },
          {
            "name": "successCount",
            "type": "u64"
          },
          {
            "name": "failureCount",
            "type": "u64"
          },
          {
            "name": "totalPings",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "label",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "monitorCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "label",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "interval",
            "type": "i64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "monitorUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "label",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "interval",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "pingRecorded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "label",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "success",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "totalPings",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
