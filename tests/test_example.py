from examples.payment_gate import authorize_payment, count_supported

def test_gate():
    assert authorize_payment(['SUPPORTED'])
    assert not authorize_payment([])
    assert not authorize_payment(['SUPPORTED','UNKNOWN'])
    assert not authorize_payment(['CONTRADICTED'])
    assert count_supported(['SUPPORTED','UNKNOWN','SUPPORTED'])==2
