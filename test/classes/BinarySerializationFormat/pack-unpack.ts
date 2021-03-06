import * as assert from 'assert'

import Binary from 'test/types/Binary'
import EmptyBinary from 'test/types/EmptyBinary'
import Move from 'test/types/Move'
import Moved from 'test/types/Moved'
import MessageType from 'megadata/classes/MessageType'

describe('pack/unpack', () => {
  it('works properly with empty message types', () => {
    const instance = EmptyBinary.create()
    const buffer = instance.pack()

    assert.strictEqual(buffer.byteLength, 1)

    const ret = MessageType.parse<EmptyBinary>(buffer)

    assert.strictEqual(ret.constructor.name, 'EmptyBinary')
    assert.strictEqual(Object.keys(ret).length, 0)
  })

  it('works properly with inheritance', () => {
    // Attributes should not have the same content
    assert.notDeepStrictEqual(Move.attributes, Moved.attributes)

    const superclass = Move.create()
    const subclass = Moved.create()
    const superBuffer = superclass.pack()
    const subBuffer = subclass.pack()

    // int32 + int32 + typeId
    assert.strictEqual(superBuffer.byteLength, 9)

    // inherited int32 + int32 + typeId plus it's own int32 member
    assert.strictEqual(subBuffer.byteLength, 13)

    const retSuper = MessageType.parse<Move>(superBuffer)
    const retSub = MessageType.parse<Moved>(subBuffer)

    // x and y
    assert.strictEqual(retSuper.constructor.name, 'Move')
    assert.strictEqual(Object.keys(retSuper).length, 2)

    // x, y and playerId
    assert.strictEqual(retSub.constructor.name, 'Moved')
    assert.strictEqual(Object.keys(retSub).length, 3)
  })

  it('works properly with all data fields', () => {
    const uint8 = 254
    const uint16 = 65534
    const uint32 = 4294967294
    const int8 = -122
    const int16 = -32123
    const int32 = -4294967
    const float32 = 3.402822971343994
    const float64 = 3.4028234663852888

    const instance = Binary.create({
      uint8, uint16, uint32,
      int8, int16, int32,
      float32, float64
    })

    const buffer = instance.pack()

    assert.strictEqual(buffer.byteLength, 27)

    const ret = MessageType.parse<Binary>(buffer)

    assert.strictEqual(ret.uint8, uint8)
    assert.strictEqual(ret.uint16, uint16)
    assert.strictEqual(ret.uint32, uint32)
    assert.strictEqual(ret.int8, int8)
    assert.strictEqual(ret.int16, int16)
    assert.strictEqual(ret.int32, int32)
    assert.strictEqual(ret.float32, float32)
    assert.strictEqual(ret.float64, float64)
  })
})
