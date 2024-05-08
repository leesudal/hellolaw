import { useEffect, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

import styled from '@emotion/styled';

const ContentBoxContainer = styled.div`
  width: 100%;
  min-width: 200px;
  height: auto;
  position: relative;
  display: flex;
  justify-items: flex-start;
  gap: 16px;
  flex-flow: wrap;
  font-size: 15px;
`;

const CategoryWrapper = styled.div`
  min-width: 80px;
  width: auto;
  padding: 0 10px;
  height: 30px;
  position: relative;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 17px;
`;

const DynamicColorText = styled.div<{ $isSelected: boolean }>`
  font-size: 17px;
  font-weight: bold;
  color: ${(props) => (props.$isSelected ? props.theme.primary : props.theme.gray1)};
`;

const ModalWrapper = styled.div`
  position: absolute;
  border-radius: 8px;
  bottom: 40px;
  left: 0px;
  display: inlin-flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-shrink: 0;
  gap: 5px;
  width: 270px;
  padding: 25px;
  background-color: #ffffff;
  border: 1px sloid ${(props) => props.theme.gray1};
  box-shadow:
    0px 10px 20px 0px rgba(0, 0, 0, 0.08),
    0px 0px 2px 0px rgba(0, 0, 0, 0.12);
`;

const ModalCategoryButtonWrapper = styled.button`
  font-size: 17px;
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => props.theme.gray2};
  }
`;

const OptionDetailModal = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 7px 22px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  height: auto;
  position: relative;
`;

const SearchOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  align-items: flex-start;
  justify-content: flex-start;
  height: auto;
  padding: 0 40px;
  width: 100%;
  position: relative;
`;

const OptionText = styled.div`
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;
  position: relative;
  color: #0080FF;
`;

const Color = styled.div`
  color: #0080FF;
`

interface CategoryModalProps {
  onCategoryClick: (category: string) => void;
  selectedCategory: string;
}

const CategoryModal = ({ onCategoryClick, selectedCategory }: CategoryModalProps) => {
  const categories = [
    '스토킹',
    '성범죄',
    '폭행/상해',
    '사기',
    '상속/가사',
    '이혼',
    '교통사고/음주운전',
    '마약',
    '대여금/미수금/채권추심',
    '행정소송',
    '소비자분쟁',
    '기타',
  ];

  return (
    <ModalWrapper>
      {categories.map((category, index) => (
        <DynamicColorText
          key={index}
          $isSelected={category === selectedCategory}
          onClick={() => onCategoryClick(category)}
        >
          <ModalCategoryButtonWrapper>{category}</ModalCategoryButtonWrapper>
        </DynamicColorText>
      ))}
    </ModalWrapper>
  );
};

interface SecondContentProps {
  selectedText: string;
  onTextClick: (text: string) => void;
}

const SecondContent = ({ selectedText, onTextClick }: SecondContentProps) => (
  <ModalWrapper>
    <DynamicColorText $isSelected={selectedText === '피해자'} onClick={() => onTextClick('피해자')}>
      <ModalCategoryButtonWrapper>피해자</ModalCategoryButtonWrapper>
    </DynamicColorText>
    <DynamicColorText $isSelected={selectedText === '가해자'} onClick={() => onTextClick('가해자')}>
      <ModalCategoryButtonWrapper>가해자</ModalCategoryButtonWrapper>
    </DynamicColorText>
  </ModalWrapper>
);

interface OptionsType {
  category: string;
  humanType: string;
}

interface PropsType {
  setOptionsData: React.Dispatch<React.SetStateAction<OptionsType>>;
}

const ContentBox = ({ setOptionsData }: PropsType) => {
  const [showOptions1, setShowOptions1] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const [options, setOptions] = useState<OptionsType>({
    category: '-',
    humanType: '-',
  });

  const { category, humanType } = options;

  const handleOptionsShow = (type: string) => {
    if (type === 'category') {
      setShowOptions1(!showOptions1); // showOptions1의 상태를 토글
    } else if (type === 'humanType') {
      setShowOptions2(!showOptions2); // showOptions2의 상태를 토글
    }
  };  

  const handleCategoryClick = (value: string) => {
    setOptions((prev) => ({
      ...prev,
      category: value,
    }));
    setOptionsData((prev) => ({
      ...prev,
      category: value,
    }));
    setShowOptions1(false);
  };

  const handleTextClick = (text: string) => {
    setOptions((prev) => ({
      ...prev,
      humanType: text,
    }));
    setOptionsData((prev) => ({
      ...prev,
      humanType: text,
    }));
    setShowOptions2(false);
  };

  useEffect(() => {
    if (category !== '-' || humanType !== '-') setShowGuide(false);
  }, [category, humanType]);

  return (
    <SearchOptionContainer>
      {showGuide && (
        <OptionDetailModal>
          <OptionText>추가 옵션을 선택해주신다면 더 정확도 높은 답변이 나와요!</OptionText>
        </OptionDetailModal>
      )}

      <ContentBoxContainer>
        <Color>
          <CategoryWrapper onClick={() => handleOptionsShow('category')}>
            {category}
            <RiArrowDownSLine />
            {showOptions1 && <CategoryModal onCategoryClick={handleCategoryClick} selectedCategory={category} />}
          </CategoryWrapper>
        </Color>

        <CategoryWrapper onClick={() => handleOptionsShow('humanType')}>
          {humanType}
          <RiArrowDownSLine />
          {showOptions2 && <SecondContent onTextClick={handleTextClick} selectedText={humanType} />}
        </CategoryWrapper>
      </ContentBoxContainer>
    </SearchOptionContainer>
  );
};

export default ContentBox;
