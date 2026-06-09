import assessmentService from '../assessmentService';
import api from '../api';

jest.mock('../api');

describe('AssessmentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAssessments success returns assessments array', async () => {
    const assessments = [
      { id: 1, title: 'Quiz 1', status: 'pending', dueDate: '2026-06-20' },
    ];
    api.get.mockResolvedValueOnce({ data: assessments });

    const result = await assessmentService.getAssessments(1);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(assessments);
  });

  test('getAssessments failure returns error', async () => {
    api.get.mockRejectedValueOnce({
      response: { data: { message: 'Not found' } },
    });

    const result = await assessmentService.getAssessments(999);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Not found');
  });

  test('getAssessmentDetails success returns details', async () => {
    const details = {
      id: 1,
      title: 'Quiz 1',
      description: 'Test quiz',
      status: 'pending',
    };
    api.get.mockResolvedValueOnce({ data: details });

    const result = await assessmentService.getAssessmentDetails(1);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(details);
  });

  test('submitAssessment success returns confirmation', async () => {
    const response = { success: true, message: 'Submitted' };
    api.post.mockResolvedValueOnce({ data: response });

    const result = await assessmentService.submitAssessment(1, {
      answers: [],
    });

    expect(result.success).toBe(true);
  });
});

