type EndianType = "big" | "little";

export class ByteStream {
    private dataView: DataView;
    private isLittleEndian: boolean;
    private offset: number;

    /**
     * Creates an instance of ByteStream.
     *
     * @constructor
     * @param {number} size size of `ArrayBuffer` to allocate
     * @param {EndianType} endian
     */
    constructor(size: number, endian: EndianType);
    /**
     * Creates an instance of ByteStream.
     *
     * @constructor
     * @param {ArrayBuffer} arrayBuffer `ArrayBuffer` to read data from it
     * @param {EndianType} endian
     */
    constructor(arrayBuffer: ArrayBuffer, endian: EndianType);
    /**
     * Creates an instance of ByteStream.
     *
     * @constructor
     * @param {Uint8Array} u8array `Uint8Array` to read data from it
     * @param {EndianType} endian
     */
    constructor(u8array: Uint8Array, endian: EndianType);

    /** @internal */
    constructor(sizeOrArray: number | ArrayBuffer | Uint8Array, endian: EndianType = "big") {
        const isNumber = typeof sizeOrArray == "number";
        const isArrayBuffer = sizeOrArray instanceof ArrayBuffer;

        isNumber
            ? this.dataView = new DataView(new ArrayBuffer(sizeOrArray))
            : isArrayBuffer
                ? this.dataView = new DataView(sizeOrArray)
                : this.dataView = new DataView(sizeOrArray.buffer);
                
        this.isLittleEndian = endian == "little";
        this.offset = 0;
    }

    /**
     * Reads unsigned char
     *
     * @returns {number}
     */
    readU8(): number {
        return this.dataView.getUint8(this.offset++);
    }

    /**
     * Reads signed char
     * 
     * @returns {number}
     */
    readS8(): number {
        if (this.offset >= this.dataView.buffer.byteLength)
            return 0;


        return this.dataView.getInt8(this.offset++);
    }

    /**
     * Reads unsigned short
     *
     * @returns {number}
     */
    readU16(): number {
        if (this.offset + 1 >= this.dataView.buffer.byteLength) 
            return 0;

        const value = this.dataView.getUint16(this.offset, this.isLittleEndian);
        this.offset += 2;
        return value;
    }

    /**
     * Reads signed short
     *
     * @returns {number}
     */
    readS16(): number {
        if (this.offset + 1 >= this.dataView.buffer.byteLength)
            return 0;

        const value = this.dataView.getInt16(this.offset, this.isLittleEndian);
        this.offset += 2;
        return value;
    }

    /**
     * Reads unsigned int
     *
     * @returns {number}
     */
    readU32(): number {
        if (this.offset + 3 >= this.dataView.buffer.byteLength)
            return 0;

        const value = this.dataView.getUint32(this.offset, this.isLittleEndian);
        this.offset += 4;
        return value;
    }

    /**
     * Reads signed int
     *
     * @returns {number}
     */
    readS32(): number {
        if (this.offset + 3 >= this.dataView.buffer.byteLength)
            return 0;

        const value = this.dataView.getInt32(this.offset, this.isLittleEndian);
        this.offset += 4;
        return value;
    }

    /**
     * Reads unsigned long
     *
     * @returns {bigint}
     */
    readU64(): bigint {
        if (this.offset + 7 > this.dataView.buffer.byteLength)
            return 0n;

        const value = this.dataView.getBigUint64(this.offset, this.isLittleEndian);
        this.offset += 8;
        return value;
    }

    /**
     * Reads signed long
     *
     * @returns {bigint}
     */
    readS64(): bigint {
        if (this.offset + 7 > this.dataView.buffer.byteLength)
            return 0n;

        const value = this.dataView.getBigInt64(this.offset, this.isLittleEndian);
        this.offset += 8;
        return value;
    }

    /**
     * Reads `n` of bytes
     *
     * @param {number} n size of bytes to read
     * @returns {ArrayBuffer}
     */
    readBytes(n: number): ArrayBuffer {
        if (this.offset + n > this.dataView.byteLength)
            return new ArrayBuffer(0);

        const value = this.dataView.buffer.slice(this.offset, this.offset + n);
        this.offset += n;
        return value;
    }

    /**
     * Writes unsigned char
     *
     * @param {number} value
     */
    writeU8(value: number) {
        if (this.offset >= this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setUint8(this.offset++, value);
    }

    /**
     * Writes signed char
     *
     * @param {number} value
     */
    writeS8(value: number) {
        if (this.offset >= this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setInt8(this.offset++, value);
    }

    /**
     * Writes unsigned short
     *
     * @param {number} value
     */
    writeU16(value: number) {
        if (this.offset + 1 > this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setUint16(this.offset, value);
        this.offset += 2;
    }

    /**
     * Writes signed short
     *
     * @param {number} value
     */
    writeS16(value: number) {
        if (this.offset + 1 > this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setInt16(this.offset, value);
        this.offset += 2;
    }

    /**
     * Writes unsigned int
     *
     * @param {number} value
     */
    writeU32(value: number) {
        if (this.offset + 3 > this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setUint32(this.offset, value);
        this.offset += 4;
    }
    
    /**
     * Writes signed int
     *
     * @param {number} value
     */
    writeS32(value: number) {
        if (this.offset + 3 > this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setInt32(this.offset, value);
        this.offset += 4;
    }

    /**
     * Writes unsigned long
     *
     * @param {bigint} value
     */
    writeU64(value: bigint) {
        if (this.offset + 7 > this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setBigUint64(this.offset, value);
        this.offset += 8;
    }

    /**
     * Writes signed long
     *
     * @param {bigint} value
     */
    writeS64(value: bigint) {
        if (this.offset + 7 > this.dataView.buffer.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        this.dataView.setBigInt64(this.offset, value);
        this.offset += 8;
    }

    /**
     * Writes array of number as bytes
     *
     * @param {number[]} value
     */
    writeBytes(value: number[]): void;
    /**
     * Writes `ArrayBuffer` as bytes
     *
     * @param {ArrayBuffer} value
     */
    writeBytes(value: ArrayBuffer): void;
    /**
     * Writes `Uint8Array` as bytes
     *
     * @param {Uint8Array} value
     */
    writeBytes(value: Uint8Array): void;

    /** @internal */
    writeBytes(value: number[] | ArrayBuffer | Uint8Array) {
        const isArrayBuffer = value instanceof ArrayBuffer;
        
        const temp = new Uint8Array(this.dataView.buffer);
        const valueAsU8Array = isArrayBuffer ? new Uint8Array(value) : value;

        if (this.offset + valueAsU8Array.length > this.dataView.byteLength)
            throw new Error("Failed to write data because there is not enough space, please specify more space in the constructor");

        temp.set(valueAsU8Array, this.offset);
        this.offset += valueAsU8Array.length;
    }

    /** Resets offset */
    reset() {
        this.offset = 0;
    }
}
