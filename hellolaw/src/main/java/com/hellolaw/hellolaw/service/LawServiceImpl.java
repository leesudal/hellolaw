package com.hellolaw.hellolaw.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.hellolaw.hellolaw.dto.LawDetailResponse;
import com.hellolaw.hellolaw.dto.LawRankingResponse;
import com.hellolaw.hellolaw.entity.Category;
import com.hellolaw.hellolaw.entity.Law;
import com.hellolaw.hellolaw.exception.HelloLawBaseException;
import com.hellolaw.hellolaw.mapper.LawMapper;
import com.hellolaw.hellolaw.repository.LawRepository;
import com.hellolaw.hellolaw.util.CategoryConverter;
import com.hellolaw.hellolaw.util.ErrorBase;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class LawServiceImpl implements LawService {

	private final LawRepository lawRepository;
	private final LawMapper lawMapper;
	private final RedisTemplate<String, Object> redisTemplate;

	@Override
	public LawDetailResponse getLawDetail(String lawName) {
		Law law = lawRepository.findByName(lawName)
			.orElseThrow(() -> new HelloLawBaseException(ErrorBase.E400_INVALID_LAW_NAME));
		Long cur = law.getCount();
		law.updateCount(cur + 1);
		lawRepository.save(law);
		return lawMapper.toLawDetailResponse(law);
	}

	@Override
	public List<LawRankingResponse> getLawRanking(String category) {
		Category categoryKey = CategoryConverter.getCategoryInEnum(category);
		Object lawsObj = redisTemplate.opsForList().leftPop(categoryKey.toString().trim());
		List<LawRankingResponse> lawsList = (List<LawRankingResponse>)lawsObj;
		List<LawRankingResponse> lawRankingResponseList = new ArrayList<>();

		if (lawsList.isEmpty() || lawsList == null) {
			log.info("lawSet is null or empty");
			List<Law> lawRanking = lawRepository.findTop10ByCategoryOrderByCountDesc(categoryKey);
			for (Law law : lawRanking) {
				LawRankingResponse lawRankingResponse = lawMapper.toLawRankingResponse(law);
				lawRankingResponseList.add(lawRankingResponse);
			}
		} else {
			for (LawRankingResponse resonse : lawsList) {
				lawRankingResponseList.add(resonse);
			}
		}

		return lawRankingResponseList;
	}
}
