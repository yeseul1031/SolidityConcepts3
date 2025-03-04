import { expect } from 'chai';
import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

describe('Calculator', function () {
  let calculator: any;
  let mathLibrary: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const MathLibrary = await ethers.getContractFactory('MathLibrary');
    mathLibrary = await MathLibrary.deploy();
    await mathLibrary.waitForDeployment();

    const Calculator = await ethers.getContractFactory('Calculator');

    calculator = await Calculator.deploy();
    await calculator.waitForDeployment();
  });

  describe('\nAbstractCalculator 컨트랙트', function () {
    describe('라이선스 및 Solidity 버전 검사', function () {
      it('컨트랙트에서 SPDX 주석으로 라이선스가 있어야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/AbstractCalculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');
        expect(sourceCode.match(/\/\/ SPDX-License-Identifier:/)).to.not.be
          .null;
      });

      it('컨트랙트에서 Solidity 버전이 0.8.0 이상, 0.9.0 미만이어야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/AbstractCalculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        const versionMatch = sourceCode.match(/pragma solidity\s+([^;]+);/);
        expect(versionMatch).to.not.be.null;

        const solidityVersion = versionMatch![1].trim();
        const validVersions = ['>=0.8.0 <0.9.0', '^0.8.0'];

        expect(validVersions.includes(solidityVersion)).to.be.true;
      });
    });

    describe('파일 import 및 상속 확인', function () {
      it('컨트랙트에서 ICalculator.sol을 import해야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/AbstractCalculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        expect(sourceCode.match(/import\s+["']\.\/ICalculator\.sol["'];/)).to
          .not.be.null;
      });

      it('컨트랙트에서 MathLibrary.sol을 import해야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/AbstractCalculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        expect(sourceCode.match(/import\s+["']\.\/MathLibrary\.sol["'];/)).to
          .not.be.null;
      });

      it('AbstractCalculator가 ICalculator 인터페이스를 상속받아야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/AbstractCalculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        expect(
          sourceCode.match(
            /\babstract\s+contract\s+AbstractCalculator\s+is\s+ICalculator\s*{/
          )
        ).to.not.be.null;
      });
    });

    describe('라이브러리(MathLibrary) 활용 검사', function () {
      it('AbstractCalculator에서는 using for 문법을 사용하여 MathLibrary를 uint256 타입에 적용합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/AbstractCalculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        expect(sourceCode.match(/\busing\s+MathLibrary\s+for\s+uint256\s*;/)).to
          .not.be.null;
      });
    });
  });

  describe('\nCalculator 컨트랙트', function () {
    describe('라이선스 및 Solidity 버전 검사', function () {
      it('컨트랙트에서 SPDX 주석으로 라이선스가 있어야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/Calculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');
        expect(sourceCode.match(/\/\/ SPDX-License-Identifier:/)).to.not.be
          .null;
      });

      it('컨트랙트에서 Solidity 버전이 0.8.0 이상, 0.9.0 미만이어야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/Calculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        const versionMatch = sourceCode.match(/pragma solidity\s+([^;]+);/);
        expect(versionMatch).to.not.be.null;

        const solidityVersion = versionMatch![1].trim();
        const validVersions = ['>=0.8.0 <0.9.0', '^0.8.0'];

        expect(validVersions.includes(solidityVersion)).to.be.true;
      });
    });

    describe('파일 import 및 상속 확인', function () {
      it('컨트랙트에서 AbstractCalculator.sol을 import해야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/Calculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        expect(
          sourceCode.match(/import\s+["']\.\/AbstractCalculator\.sol["'];/)
        ).to.not.be.null;
      });

      it('Calculator가 AbstractCalculator를 상속받아야 합니다.', async function () {
        const contractPath = path.join(
          __dirname,
          '../contracts/calculator/Calculator.sol'
        );
        const sourceCode = fs.readFileSync(contractPath, 'utf8');

        expect(
          sourceCode.match(
            /\bcontract\s+Calculator\s+is\s+AbstractCalculator\s*{/
          )
        ).to.not.be.null;
      });
    });

    describe('calculate 함수 기능 검증', function () {
      it('함수 calculate는 인자(uint256 - a, uint256 - b, string - operation)를 받아서 uint256 타입을 리턴해야 합니다.', async function () {
        expect(await calculator.calculate(2, 3, 'add')).to.equal(5);
        expect(await calculator.calculate(5, 2, 'subtract')).to.equal(3);
        expect(await calculator.calculate(3, 4, 'multiply')).to.equal(12);
        expect(await calculator.calculate(8, 2, 'divide')).to.equal(4);
      });

      it("calculate(2, 3, 'add')를 실행 시키면 5가 리턴 되어야 합니다.", async function () {
        expect(await calculator.calculate(2, 3, 'add')).to.equal(5);
      });

      it("calculate(5, 2, 'subtract')를 실행 시키면 3이 리턴 되어야 합니다.", async function () {
        expect(await calculator.calculate(5, 2, 'subtract')).to.equal(3);
      });

      it("calculate(3, 4, 'multiply')를 실행 시키면 12가 리턴 되어야 합니다.", async function () {
        expect(await calculator.calculate(3, 4, 'multiply')).to.equal(12);
      });

      it("calculate(8, 2, 'divide')를 실행 시키면 4가 리턴 되어야 합니다.", async function () {
        expect(await calculator.calculate(8, 2, 'divide')).to.equal(4);
      });

      it("calculate(2, 5, 'subtract')를 실행 시키면 'Underflow error' 오류가 발생해야 합니다.", async function () {
        await expect(calculator.calculate(2, 5, 'subtract')).to.be.revertedWith(
          'Underflow error'
        );
      });

      it("calculate(8, 0, 'divide')를 실행 시키면 'Division by zero' 오류가 발생해야 합니다.", async function () {
        await expect(calculator.calculate(8, 0, 'divide')).to.be.revertedWith(
          'Division by zero'
        );
      });

      it("calculate(8, 0, '잘못된 연산')를 실행 시키면 'Invalid operation' 오류가 발생해야 합니다.", async function () {
        await expect(
          calculator.calculate(8, 2, '잘못된 연산')
        ).to.be.revertedWith('Invalid operation');
        await expect(
          calculator.calculate(8, 2, '아 배고파')
        ).to.be.revertedWith('Invalid operation');
      });
    });
  });

  describe('\nAbstractCalculator 컨트랙트', function () {
    it('함수 add는 인자(uint256, uint256)를 받아서 MathLibrary의 add를 적용한 uint256 타입을 리턴해야 합니다.', async function () {
      expect(await calculator.calculate(2, 3, 'add')).to.equal(5);
    });

    it('함수 subtract는 인자(uint256, uint256)를 받아서 MathLibrary의 subtract를 적용한 uint256 타입을 리턴해야 합니다.', async function () {
      expect(await calculator.calculate(5, 2, 'subtract')).to.equal(3);
    });

    it('함수 multiply는 인자(uint256, uint256)를 받아서 MathLibrary의 multiply를 적용한 uint256 타입을 리턴해야 합니다.', async function () {
      expect(await calculator.calculate(3, 4, 'multiply')).to.equal(12);
    });

    it('함수 divide는 인자(uint256, uint256)를 받아서 MathLibrary의 divide를 적용한 uint256 타입을 리턴해야 합니다.', async function () {
      expect(await calculator.calculate(8, 2, 'divide')).to.equal(4);
    });
  });
});
